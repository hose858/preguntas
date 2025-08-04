const questionBox = document.getElementById('question');
const answerArea = document.getElementById('answer-area');
const nextBtn = document.getElementById('next-btn');
const answersUl = document.getElementById('answers-ul');
const answersListDiv = document.getElementById('answers-list');

let remainingQuestions = [...questions];
let currentQuestion = null;
let answers = [];
let currentInput = null;
const progressBar = document.getElementById('progress');
let totalQuestions = questions.length;

function getNextQuestion() {
    if (remainingQuestions.length === 0) return null;
    return remainingQuestions[0];
}

function showQuestion(q) {
    // Animación de salida
    questionBox.parentElement.classList.remove('fadeIn');
    void questionBox.parentElement.offsetWidth;
    questionBox.parentElement.classList.add('fadeIn');

    questionBox.textContent = q.text;
    answerArea.innerHTML = '';
    currentInput = null;
    if (q.type === 'option') {
        q.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.textContent = opt;
            btn.className = 'option-btn';
            btn.onclick = () => {
                saveAnswer(q.text, opt);
                goToNext();
            };
            answerArea.appendChild(btn);
        });
    } else if (q.type === 'text') {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Escribe tu respuesta...';
        input.className = 'text-input';
        answerArea.appendChild(input);
        currentInput = input;
    }
    updateProgress();
}
function updateProgress() {
    const done = totalQuestions - remainingQuestions.length;
    const percent = Math.round((done / totalQuestions) * 100);
    if (progressBar) {
        progressBar.style.width = percent + '%';
    }
}


function saveAnswer(question, answer) {
    answers.push({ question, answer });
}

function renderAnswers() {
    answersUl.innerHTML = '';
    answers.forEach((item) => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${item.question}</strong><br><span>${item.answer}</span>`;
        answersUl.appendChild(li);
    });
}

function goToNext() {
    // Si la pregunta actual es de texto, guardar la respuesta si hay algo escrito
    if (currentQuestion && currentQuestion.type === 'text' && currentInput) {
        const val = currentInput.value.trim();
        saveAnswer(currentQuestion.text, val || '(Sin respuesta)');
    }
    // Eliminar la pregunta actual del array
    if (remainingQuestions.length > 0) {
        remainingQuestions.shift();
    }
    // Si ya no hay más preguntas, mostrar respuestas
    if (remainingQuestions.length === 0) {
        showEnd();
    } else {
        currentQuestion = getNextQuestion();
        showQuestion(currentQuestion);
    }
}

function showEnd() {
    if (progressBar) progressBar.style.width = '100%';
    questionBox.textContent = '¡Has respondido todas las preguntas!';
    answerArea.innerHTML = '';
    answersListDiv.style.display = 'block';
    renderAnswers();
    nextBtn.style.display = 'none';
    const copyBtn = document.getElementById('copy-btn');
    const copyMsg = document.getElementById('copy-msg');
    if (copyBtn) {
        copyBtn.onclick = () => {
            const text = answers.map(a => `${a.question}\n${a.answer}\n`).join('\n');
            navigator.clipboard.writeText(text).then(() => {
                copyMsg.style.display = 'inline';
                setTimeout(() => { copyMsg.style.display = 'none'; }, 1500);
            });
        };
    }
}

nextBtn.addEventListener('click', goToNext);

function startGame() {
    answers = [];
    remainingQuestions = [...questions];
    totalQuestions = questions.length;
    answersListDiv.style.display = 'none';
    nextBtn.style.display = 'inline-block';
    currentQuestion = getNextQuestion();
    showQuestion(currentQuestion);
}

// Inicializar
startGame();
