from datasets import load_dataset
from transformers import AutoTokenizer,AutoModelForSequenceClassification,TrainingArguments, Trainer
import numpy as np
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

dataset = load_dataset("csv", data_files="dataset.csv")

dataset = dataset["train"].train_test_split(test_size=0.2,seed=42)

labels = list(set(dataset["train"]["categoria"]))
label2id = {l:i for i,l in enumerate(labels)}
id2label = {i:l for l,i in label2id.items()}

def encode_labels(example):
    example["labels"] = label2id[example["categoria"]]
    return example

dataset = dataset.map(encode_labels)

tokenizer = AutoTokenizer.from_pretrained(
    "bert-base-multilingual-cased"
)
def tokenize(batch):
    return tokenizer(
        batch["texto"],
        truncation=True
    )

dataset = dataset.map(tokenize, batched=True)

dataset = dataset.remove_columns(["id", "texto", "categoria"])
dataset.set_format("torch")

model = AutoModelForSequenceClassification.from_pretrained(
    "bert-base-multilingual-cased",
    num_labels=len(labels),
    label2id=label2id,
    id2label=id2label
)

def compute_metrics(eval_pred):
    logits, labels = eval_pred
    predictions = np.argmax(logits, axis=1)

    return {
        "accuracy": accuracy_score(labels, predictions),
        "precision": precision_score(labels, predictions, average="weighted"),
        "recall": recall_score(labels, predictions, average="weighted"),
        "f1": f1_score(labels, predictions, average="weighted")
    }

training_args = TrainingArguments(
    output_dir="./bert-finetuned",
    learning_rate=2e-5,
    per_device_train_batch_size=8,
    num_train_epochs=3,
    weight_decay=0.01,
    logging_steps=50,
    save_strategy="epoch",
    eval_strategy="epoch",
    load_best_model_at_end=True,
    metric_for_best_model="f1"
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=dataset["train"],
    eval_dataset=dataset["test"],
    tokenizer=tokenizer,
    compute_metrics=compute_metrics
)

trainer.train()
trainer.save_model("./bert-finetuned")
tokenizer.save_pretrained("./bert-finetuned")
