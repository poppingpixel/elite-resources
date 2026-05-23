# Data Ingestion & Splitting

# Data

## 🔢 Data ingestion

```python
import pandas as pd
```

```python
# Data ingestion
DATASET_LOC = "https://raw.githubusercontent.com/GokuMohandas/Made-With-ML/main/datasets/dataset.csv"
df = pd.read_csv(DATASET_LOC)
df.head()
```

## ✂️ Data splitting

```python
from sklearn.model_selection import train_test_split
```

```python
# Value counts
df.tag.value_counts()
```

```python
# Split dataset
test_size = 0.2
train_df, val_df = train_test_split(df, stratify=df.tag, test_size=test_size, random_state=1234)
```

```python
# Train value counts
train_df.tag.value_counts()
```

```python
# Validation (adjusted) value counts
val_df.tag.value_counts() * int((1-test_size) / test_size)
```
