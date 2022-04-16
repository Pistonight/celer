"""CSV utilities"""
import csv

_memo = {}
def read_csv(data_name, line_callback):
    """Memoized wrapper"""
    if data_name in _memo:
        for line in _memo[data_name]:
            line_callback(line)
    else:
        _read_csv_from_file(data_name, line_callback)

def _read_csv_from_file(data_name, line_callback):
    """Read CSV file in src and use callback to process it"""
    lines = []
    with open(f"src/{data_name}.csv", "r", encoding="utf-8") as csv_file:
        headers = None
        reader = csv.reader(csv_file)
        first_line = True
        for row in reader:
            if first_line:
                # Skip first line with headers
                first_line = False
                headers = row
            else:
                mapping = {}
                for i, header in enumerate(headers):
                    if i < len(row):
                        mapping[header] = row[i]
                    else:
                        mapping[header] = ""
                line_callback(mapping)
                lines.append(mapping)
    _memo[data_name] = lines
