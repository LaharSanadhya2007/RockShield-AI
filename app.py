from flask import Flask, render_template, request, jsonify
import random   # ✅ import at top

# create app
app = Flask(__name__)

# home route
@app.route('/')
def home():
    return render_template("index.html")

# analyze route
@app.route('/analyze', methods=['POST'])
def analyze():
    file = request.files['image']

    if file:
        # simulated AI logic
        is_crack = random.choice([True, False])

        if is_crack:
            return jsonify({
                "result": "❌ Crack Detected <br> ⚠️ Risk Level: High"
            })
        else:
            return jsonify({
                "result": "✅ No Crack Detected <br> ✔️ Safe Structure"
            })

    return jsonify({
        "result": "❌ Error"
    })

# run app
if __name__ == "__main__":
    app.run(debug=True)