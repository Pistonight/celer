"CSV utilities"
import csv

def read_csv(data_name, line_callback):
    """Read CSV file in src and use callback to process it"""
    with open(f"src/{data_name}.csv", "r", encoding="utf-8") as csv_file:
        reader = csv.reader(csv_file)
        first_line = True
        for row in reader:
            if first_line:
                # Skip first line with headers
                first_line = False
            else:
                line_callback(row)
