from datasets import Dataset
import pandas as pd
from transformers import AutoTokenizer,BertForTokenClassification, DataCollatorForTokenClassification,TrainingArguments, Trainer

df = pd.read_csv("datasetFormated.csv", encoding='latin-1')
print(df.head())
sentences = []
labels = []


for _, group in df.groupby("ï»¿id"):
    sentences.append(group["texto"].tolist())
    labels.append(group["categoria"].tolist())

dataset = Dataset.from_dict({
    "tokens": sentences,
    "ner_tags": labels
})

dataset = dataset.train_test_split(test_size=0.2)

label_list = ["O", "B-TRABAJO", "I-TRABAJO", "B-PERSONAL", "I-PERSONAL", "B-FAMILIAR", "I-FAMILIAR", "B-AMOROSA", "I-AMOROSA"]
label2id = {l: i for i, l in enumerate(label_list)}
id2label = {i: l for l, i in label2id.items()}

tokenizer = AutoTokenizer.from_pretrained(
    "bert-base-multilingual-cased"
)

def tokenize_and_align_labels(examples):
    tokenized = tokenizer(
        examples["tokens"],
        is_split_into_words=True,
        truncation=True
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
                label_ids.append(
                    label2id[label[word_id]]
                    if label[word_id].startswith("I")
                    else -100
                )
            prev_word_id = word_id

        aligned_labels.append(label_ids)

    tokenized["labels"] = aligned_labels
    return tokenized

dataset = dataset.map(tokenize_and_align_labels, batched=True)

model = BertForTokenClassification.from_pretrained(
    "bert-base-multilingual-cased",
    num_labels=len(label_list),
    id2label=id2label,
    label2id=label2id
)

training_args = TrainingArguments(
    output_dir="./bert-ner",
    eval_strategy="epoch",
    save_strategy="epoch",
    per_device_train_batch_size=8,
    num_train_epochs=5,
    learning_rate=2e-5,
    weight_decay=0.01,
    logging_steps=50,
    load_best_model_at_end=True
)

data_collator = DataCollatorForTokenClassification(tokenizer)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=dataset["train"],
    eval_dataset=dataset["test"],
    tokenizer=tokenizer,
    data_collator=data_collator
)
trainer.train()

trainer.save_model("./bert-ner")
tokenizer.save_pretrained("./bert-ner")