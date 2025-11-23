// index.js (короткий вивід у блоці; деталі — тільки в файлі)

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

// Майстер-список питань у тій самій послідовності (1..25)
const masterQuestions = [
	...questionsThoughtsAndFeeling,
	...questionsActivitiesAndPersonalRelationships,
	...questionsPhysicalSymptoms,
	...questionsSuicidalUrges,
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

	// Текст питання з номером
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

// Додаємо питання по секціях (це створює ті самі 25 питань)
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

// Функція, що повертає текст мітки опції за значенням
function getOptionLabelByValue(val) {
	const opt = options.find((o) => o.value === val);
	return opt ? opt.label : String(val);
}

function calculate() {
	const form = document.getElementById("testForm");
	let sum = 0;
	let missing = [];
	const perQuestionResults = []; // { idx, text, value, label }

	// Перебір від 1 до 25
	for (let i = 1; i <= 25; i++) {
		const name = "q" + i;
		const vals = form.elements[name];
		let val = null;

		if (!vals) {
			missing.push(i);
			perQuestionResults.push({
				idx: i,
				text: masterQuestions[i - 1] || "(питання відсутнє)",
				value: null,
				label: "(немає відповіді)",
			});
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
			perQuestionResults.push({
				idx: i,
				text: masterQuestions[i - 1] || "(питання відсутнє)",
				value: null,
				label: "(немає відповіді)",
			});
		} else {
			sum += val;
			perQuestionResults.push({
				idx: i,
				text: masterQuestions[i - 1] || "(питання відсутнє)",
				value: val,
				label: getOptionLabelByValue(val),
			});
		}
	}

	// Підрахуємо підсумки по секціях (індекси у masterQuestions: 0-based)
	const sectionSums = {
		thoughtsAndFeeling: 0, // 1..10  -> idx 0..9
		activitiesAndRelationships: 0, // 11..17 -> idx 10..16
		physicalSymptoms: 0, // 18..22 -> idx 17..21
		suicidalUrges: 0, // 23..25 -> idx 22..24
	};
	perQuestionResults.forEach((r) => {
		if (r.value === null || isNaN(r.value)) return;
		const i = r.idx;
		if (i >= 1 && i <= 10) sectionSums.thoughtsAndFeeling += r.value;
		else if (i >= 11 && i <= 17)
			sectionSums.activitiesAndRelationships += r.value;
		else if (i >= 18 && i <= 22) sectionSums.physicalSymptoms += r.value;
		else if (i >= 23 && i <= 25) sectionSums.suicidalUrges += r.value;
	});

	const out = document.getElementById("output");
	out.style.display = "block";

	let interpretation = "";
	if (sum <= 5) interpretation = "депресії немає";
	else if (sum <= 10) interpretation = "нормальний, але пригнічений стан";
	else if (sum <= 25) interpretation = "легка депресія";
	else if (sum <= 50) interpretation = "помірна депресія";
	else if (sum <= 75) interpretation = "глибока депресія";
	else interpretation = "надзвичайно глибока депресія";

	// Короткий HTML звіт — тільки бали, інтерпретація, попередження, пропущені питання
	let html = "<h3>Ваш результат: " + sum + " балів</h3>";
	html += "<p><strong>Інтерпретація:</strong> " + interpretation + "</p>";

	// Показуємо підсумки по секціях (коротко)
	html += "<div class='section-sums'>";
	html +=
		"<p><strong>Підсумки по секціях (коротко):</strong></p><ul style='margin-top:6px;'>" +
		"<li>Думки та почуття (1–10): " +
		sectionSums.thoughtsAndFeeling +
		"</li>" +
		"<li>Заняття та соціальні стосунки (11–17): " +
		sectionSums.activitiesAndRelationships +
		"</li>" +
		"<li>Фізичні симптоми (18–22): " +
		sectionSums.physicalSymptoms +
		"</li>" +
		"<li>Суїцидальні думки (23–25): " +
		sectionSums.suicidalUrges +
		"</li>" +
		"</ul></div>";

	// Перевірка суїцидальних питань (сума > 0)
	const suicidQ = [23, 24, 25];
	let suicSum = 0;
	for (let q of suicidQ) {
		const r = perQuestionResults.find((x) => x.idx === q);
		if (r && typeof r.value === "number" && !isNaN(r.value)) suicSum += r.value;
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

	// Кнопка збереження — додаємо один раз (детальний звіт у файл)
	if (!document.getElementById("saveBtn")) {
		const btnSave = document.createElement("button");
		btnSave.type = "button";
		btnSave.id = "saveBtn";
		btnSave.textContent = "Зберегти детальний звіт у файл";
		btnSave.onclick = () => {
			// Створимо текстовий звіт у зручному форматі (plain text) з деталями по питаннях
			let textReport = "Детальний звіт — тест оцінки депресивних симптомів\n\n";
			textReport += "Загальний бал: " + sum + "\n";
			textReport += "Інтерпретація: " + interpretation + "\n\n";
			textReport += "Підсумки по секціях:\n";
			textReport +=
				"  Думки та почуття (1–10): " + sectionSums.thoughtsAndFeeling + "\n";
			textReport +=
				"  Заняття/стосунки (11–17): " +
				sectionSums.activitiesAndRelationships +
				"\n";
			textReport += "  Фізичні (18–22): " + sectionSums.physicalSymptoms + "\n";
			textReport +=
				"  Суїцидальні (23–25): " + sectionSums.suicidalUrges + "\n\n";
			textReport += "Деталі по питаннях (№ — питання — відповідь — бали):\n";
			perQuestionResults.forEach((r) => {
				const lbl = r.label || "(немає відповіді)";
				const val = r.value === null || isNaN(r.value) ? "-" : r.value;
				textReport += `${r.idx}. ${r.text} — ${lbl} — ${val}\n`;
			});
			textReport +=
				"\nПримітка: цей тест не є медичним діагнозом. За сумнівів зверніться до спеціаліста.\n";

			const blob = new Blob([textReport], {
				type: "text/plain;charset=utf-8",
			});
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = "depression_test_detailed_report.txt";
			document.body.appendChild(a);
			a.click();
			a.remove();
			URL.revokeObjectURL(url);
		};
		out.appendChild(btnSave);
	}
}
