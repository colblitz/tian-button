from flask import Flask, render_template, send_from_directory, jsonify

from datetime import datetime
from os.path import exists

TIMES_FILE = "times.txt"

if not exists(TIMES_FILE):
    open(TIMES_FILE, 'w').close()

DATETIME_FORMAT = "%Y-%m-%d %I:%M %p"
JS_LOCALE_FORMAT = "%-m/%-d/%Y %-I:%M:%S %p"


times = []
with open(TIMES_FILE, 'r') as f:
    for line in f:
        times.append(datetime.strptime(line.strip(), DATETIME_FORMAT))

def append_time(t):
    with open(TIMES_FILE, 'a') as f:
        f.write(datetime.strftime(t, DATETIME_FORMAT) + "\n")

##################
## Flask stuff

app = Flask(__name__, static_url_path='')

@app.route('/')
def index():
    return "nothing to see here"

@app.route('/tianbutton')
def tianbutton():
    return render_template('index.html', times=[datetime.strftime(t, JS_LOCALE_FORMAT) for t in times])

@app.route('/js/<path:path>')
def send_js(path):
    return send_from_directory('js', path)

@app.route('/buttonclicked', methods=['POST'])
def button_clicked():
    t = datetime.now()
    append_time(t)
    times.append(t)
    return {"times": ",".join([t.isoformat() for t in times])}

@app.route('/resettimes', methods=['POST'])
def reset_times():
    global times
    print("got request to reset")
    print(times)
    open(TIMES_FILE, 'w').close()
    times = []
    return {"times": ",".join([t.isoformat() for t in times])}

#### MAIN

if __name__ == '__main__':
    socket_.run(app, debug=True)