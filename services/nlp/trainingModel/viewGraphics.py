from datasets import Dataset
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

from transformers import (
    AutoTokenizer,
    BertForTokenClassification,
    DataCollatorForTokenClassification,
    TrainingArguments,
    Trainer
)

from seqeval.metrics import (
    accuracy_score,
    f1_score,
    precision_score,
    recall_score
)

# =========================================================
# CARGAR DATASET
# =========================================================

df = pd.read_csv("datasetFormated.csv", encoding='latin-1')

print(df.head())

sentences = []
labels = []

# Agrupar por ID
for _, group in df.groupby("ï»¿id"):
    sentences.append(group["texto"].tolist())
    labels.append(group["categoria"].tolist())

dataset = Dataset.from_dict({
    "tokens": sentences,
    "ner_tags": labels
})

# Dividir dataset
dataset = dataset.train_test_split(test_size=0.2)

# =========================================================
# LABELS
# =========================================================

label_list = [
    "O",
    "B-TRABAJO",
    "I-TRABAJO",
    "B-PERSONAL",
    "I-PERSONAL",
    "B-FAMILIAR",
    "I-FAMILIAR",
    "B-AMOROSA",
    "I-AMOROSA"
]

label2id = {l: i for i, l in enumerate(label_list)}
id2label = {i: l for l, i in label2id.items()}

# =========================================================
# TOKENIZER
# =========================================================

tokenizer = AutoTokenizer.from_pretrained(
    "bert-base-multilingual-cased"
)

# =========================================================
# TOKENIZAR Y ALINEAR LABELS
# =========================================================

def tokenize_and_align_labels(examples):

    tokenized = tokenizer(
        examples["tokens"],
        is_split_into_words=True,
        truncation=True,
        padding=True
    )

    aligned_labels = []

    for i, label in enumerate(examples["ner_tags"]):

        word_ids = tokenized.word_ids(batch_index=i)

        label_ids = []

        prev_word_id = None

        for word_id in word_ids:

            if word_id is None:
                label_ids.append(-100)

            elif word_id != prev_word_id:
                label_ids.append(label2id[label[word_id]])

            else:
                # Solo etiquetas I-*
                if label[word_id].startswith("I"):
                    label_ids.append(label2id[label[word_id]])
                else:
                    label_ids.append(-100)

            prev_word_id = word_id

        aligned_labels.append(label_ids)

    tokenized["labels"] = aligned_labels

    return tokenized

dataset = dataset.map(tokenize_and_align_labels, batched=True)

# =========================================================
# MODELO
# =========================================================

model = BertForTokenClassification.from_pretrained(
    "bert-base-multilingual-cased",
    num_labels=len(label_list),
    id2label=id2label,
    label2id=label2id
)

# =========================================================
# MÉTRICAS
# =========================================================

def compute_metrics(p):

    predictions, labels = p

    predictions = np.argmax(predictions, axis=2)

    true_predictions = []
    true_labels = []

    for prediction, label in zip(predictions, labels):

        current_preds = []
        current_labels = []

        for pred, lab in zip(prediction, label):

            if lab != -100:
                current_preds.append(label_list[pred])
                current_labels.append(label_list[lab])

        true_predictions.append(current_preds)
        true_labels.append(current_labels)

    return {
        "precision": precision_score(true_labels, true_predictions),
        "recall": recall_score(true_labels, true_predictions),
        "f1": f1_score(true_labels, true_predictions),
        "accuracy": accuracy_score(true_labels, true_predictions),
    }

# =========================================================
# ARGUMENTOS DE ENTRENAMIENTO
# =========================================================

training_args = TrainingArguments(
    output_dir="./bert-ner",

    eval_strategy="epoch",
    save_strategy="epoch",

    learning_rate=2e-5,
    per_device_train_batch_size=8,
    per_device_eval_batch_size=8,

    num_train_epochs=10,

    weight_decay=0.01,

    logging_dir="./logs",
    logging_steps=10,

    report_to="none",

    load_best_model_at_end=True
)

# =========================================================
# DATA COLLATOR
# =========================================================

data_collator = DataCollatorForTokenClassification(tokenizer)

# =========================================================
# TRAINER
# =========================================================

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=dataset["train"],
    eval_dataset=dataset["test"],
    tokenizer=tokenizer,
    data_collator=data_collator,
    compute_metrics=compute_metrics
)

# =========================================================
# ENTRENAMIENTO
# =========================================================

trainer.train()

# =========================================================
# GUARDAR MODELO
# =========================================================

trainer.save_model("./bert-ner")
tokenizer.save_pretrained("./bert-ner")

# =========================================================
# HISTORIAL DE ENTRENAMIENTO
# =========================================================

logs = pd.DataFrame(trainer.state.log_history)

print(logs.head())

# =========================================================
# GRÁFICA LOSS
# =========================================================

train_loss = logs[logs["loss"].notna()]
eval_loss = logs[logs["eval_loss"].notna()]

plt.figure(figsize=(10, 5))

plt.plot(
    train_loss["step"],
    train_loss["loss"],
    label="Train Loss"
)

plt.plot(
    eval_loss["step"],
    eval_loss["eval_loss"],
    label="Eval Loss"
)

plt.xlabel("Steps")
plt.ylabel("Loss")
plt.title("Training Loss vs Evaluation Loss")
plt.legend()

plt.grid(True)

plt.savefig("loss_curve.png")

plt.show()

# =========================================================
# GRÁFICA F1 SCORE
# =========================================================

eval_metrics = logs[logs["eval_f1"].notna()]

plt.figure(figsize=(10, 5))

plt.plot(
    eval_metrics["epoch"],
    eval_metrics["eval_f1"],
    marker="o"
)

plt.xlabel("Epoch")
plt.ylabel("F1 Score")
plt.title("F1 Score por Epoch")

plt.grid(True)

plt.savefig("f1_curve.png")

plt.show()

# =========================================================
# GRÁFICA ACCURACY
# =========================================================

plt.figure(figsize=(10, 5))

plt.plot(
    eval_metrics["epoch"],
    eval_metrics["eval_accuracy"],
    marker="o"
)

plt.xlabel("Epoch")
plt.ylabel("Accuracy")
plt.title("Accuracy por Epoch")

plt.grid(True)

plt.savefig("accuracy_curve.png")

plt.show()

# =========================================================
# GRÁFICA PRECISION Y RECALL
# =========================================================

plt.figure(figsize=(10, 5))

plt.plot(
    eval_metrics["epoch"],
    eval_metrics["eval_precision"],
    marker="o",
    label="Precision"
)

plt.plot(
    eval_metrics["epoch"],
    eval_metrics["eval_recall"],
    marker="o",
    label="Recall"
)

plt.xlabel("Epoch")
plt.ylabel("Score")
plt.title("Precision y Recall")

plt.legend()

plt.grid(True)

plt.savefig("precision_recall_curve.png")

plt.show()

print("\nGráficas guardadas:")
print("- loss_curve.png")
print("- f1_curve.png")
print("- accuracy_curve.png")
print("- precision_recall_curve.png")