import csv

def read_csv(data_name, line_callback):
    with open(f"src/{data_name}.csv") as csv_file:
        reader = csv.reader(csv_file)
        first_line = True
        for row in reader:
            if first_line:
                # Skip first line with headers
                first_line = False
            else:
                line_callback(row)
