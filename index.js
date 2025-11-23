// index.js (виправлений)

const questionsThoughtsAndFeeling = [
	"Сум або туга",
	"Розпач або пригнічення",
	"Напад плачу або сльозливість",
	"Збентеження",
	"Безнадія",
	"Низька самооцінка",
	"Нікчемність",
	"Провина або сором",
	"Самокритика або самозвинувачення",
	"Складнощі в прийнятті рішень",
];
const questionsActivitiesAndPersonalRelationships = [
	"Утрата цікавості до родини, друзів або колег",
	"Самотність",
	"Менший час із родиною або друзями",
	"Утрата мотивації",
	"Утрата цікавості до роботи або іншої діяльності",
	"Уникання роботи або інших обов’язків",
	"Утрата задоволення від життя",
];
const questionsPhysicalSymptoms = [
	"Утома",
	"Чутливість або сонливість",
	"Зниження або збільшення апетиту",
	"Утрата цікавості до сексу",
	"Тривога про власне здоров’я",
];
const questionsSuicidalUrges = [
	"У вас виникали думки про самогубство?",
	"Ви хотіли б, щоб ваше життя скінчилося?",
	"У вас є план завдати собі шкоди?",
];

const options = [
	{ value: 0, label: "0 — ніколи" },
	{ value: 1, label: "1 — інколи" },
	{ value: 2, label: "2 — доволі часто" },
	{ value: 3, label: "3 — часто" },
	{ value: 4, label: "4 — дуже часто" },
];

const containerQuestionsThoughtsAndFeeling = document.getElementById(
	"questionsThoughtsAndFeeling"
);
const containerQuestionsActivitiesAndPersonalRelationships =
	document.getElementById("questionsActivitiesAndPersonalRelationships");
const containerQuestionsPhysicalSymptoms = document.getElementById(
	"questionsPhysicalSymptoms"
);
const containerQuestionsSuicidalUrges = document.getElementById(
	"questionsSuicidalUrges"
);

// Глобальний індекс питань від 1 до 25
let qIndex = 1;

function createQuestionBlock(container, questionText) {
	const div = document.createElement("div");
	div.className = "questionBlock";

	// Текст питання (не додаємо автоматичний номер, бо виведемо порядковий номер окремо)
	const qn = document.createElement("div");
	qn.innerHTML = '<span class="qnum">' + qIndex + ".</span> " + questionText;
	div.appendChild(qn);

	const opts = document.createElement("div");
	opts.className = "options";

	options.forEach((opt) => {
		const id = "q" + qIndex + "o" + opt.value;
		const label = document.createElement("label");
		label.htmlFor = id;

		const radio = document.createElement("input");
		radio.type = "radio";
		radio.name = "q" + qIndex;
		radio.id = id;
		radio.value = opt.value;
		if (opt.value === 0) radio.checked = true; // default 0

		label.appendChild(radio);
		label.appendChild(document.createTextNode(" " + opt.label));
		opts.appendChild(label);
	});

	div.appendChild(opts);
	container.appendChild(div);

	qIndex++; // інкрементуємо після створення питання
}

// Додаємо питання по секціях
questionsThoughtsAndFeeling.forEach((q) =>
	createQuestionBlock(containerQuestionsThoughtsAndFeeling, q)
);
questionsActivitiesAndPersonalRelationships.forEach((q) =>
	createQuestionBlock(containerQuestionsActivitiesAndPersonalRelationships, q)
);
questionsPhysicalSymptoms.forEach((q) =>
	createQuestionBlock(containerQuestionsPhysicalSymptoms, q)
);
questionsSuicidalUrges.forEach((q) =>
	createQuestionBlock(containerQuestionsSuicidalUrges, q)
);

// Після побудови qIndex має бути 26 (1..25 створені)
function calculate() {
	const form = document.getElementById("testForm");
	let sum = 0;
	let missing = [];

	// Перебір від 1 до 25
	for (let i = 1; i <= 25; i++) {
		const name = "q" + i;
		const vals = form.elements[name];
		let val = null;

		if (!vals) {
			missing.push(i);
			continue;
		}

		// Якщо це RadioNodeList або колекція
		if (typeof vals.length === "number") {
			for (let k = 0; k < vals.length; k++) {
				if (vals[k].checked) {
					val = parseInt(vals[k].value, 10);
					break;
				}
			}
		} else {
			// одиничний елемент
			val = parseInt(vals.value || "0", 10);
		}

		if (val === null || isNaN(val)) {
			missing.push(i);
		} else {
			sum += val;
		}
	}

	const out = document.getElementById("output");
	out.style.display = "block";
	let interpretation = "";
	if (sum <= 5) interpretation = "депресії немає";
	else if (sum <= 10) interpretation = "нормальний, але пригнічений стан";
	else if (sum <= 25) interpretation = "легка депресія";
	else if (sum <= 50) interpretation = "помірна депресія";
	else if (sum <= 75) interpretation = "глибока депресія";
	else interpretation = "надзвичайно глибока депресія";

	let html = "<h3>Ваш результат: " + sum + " балів</h3>";
	html += "<p><strong>Інтерпретація:</strong> " + interpretation + "</p>";

	// Перевірка суїцидальних питань (23,24,25)
	const suicidQ = [23, 24, 25];
	let suicSum = 0;
	for (let q of suicidQ) {
		const name = "q" + q;
		const r = form.elements[name];
		let v = 0;
		if (r) {
			if (typeof r.length === "number") {
				for (let k = 0; k < r.length; k++) {
					if (r[k].checked) {
						v = parseInt(r[k].value, 10);
						break;
					}
				}
			} else {
				v = parseInt(r.value || "0", 10);
			}
		}
		if (!isNaN(v)) suicSum += v;
	}

	if (suicSum > 0) {
		html +=
			"<p class='warning'>У розділі про суїцидальні думки ви дали ненульові відповіді. Якщо у вас є думки про заподіяння собі шкоди або самогубство, будь ласка, зверніться за терміновою допомогою: лікар, швидка допомога або спеціаліст з психічного здоров'я.</p>";
	}

	if (missing.length > 0) {
		html += "<p>Не всі питання відповіли: " + missing.join(", ") + "</p>";
	}

	html +=
		"<p><em>Зверніть увагу:</em> цей тест не є медичним діагнозом. Якщо вас турбують симптоми — зверніться до фахівця.</p>";

	out.innerHTML = html;

	// Кнопка збереження — додаємо один раз
	if (!document.getElementById("saveBtn")) {
		const btnSave = document.createElement("button");
		btnSave.type = "button";
		btnSave.id = "saveBtn";
		btnSave.textContent = "Зберегти результат у файл";
		btnSave.onclick = () => {
			// Генеруємо простий текстовий звіт
			const textReport = out.innerText;
			const blob = new Blob([textReport], {
				type: "text/plain;charset=utf-8",
			});
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = "depression_test_result.txt";
			document.body.appendChild(a);
			a.click();
			a.remove();
			URL.revokeObjectURL(url);
		};
		out.appendChild(btnSave);
	}
}
