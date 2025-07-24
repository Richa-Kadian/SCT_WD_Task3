        // Quiz data
        const quizData = [
            {
                type: "single",
                question: "Which protocol is primarily used for secure communication over a computer network?",
                options: ["HTTP", "FTP", "HTTPS", "TCP"],
                correctAnswer: "HTTPS"
            },
            {
                type: "multi",
                question: "Which of the following are considered front-end technologies? (Select all that apply)",
                options: ["React", "Node.js", "CSS", "MongoDB", "Vue.js"],
                correctAnswer: ["React", "CSS", "Vue.js"]
            },
            {
                type: "fill",
                question: "The process of finding and fixing errors in code is called __________.",
                correctAnswer: "debugging"
            },
            {
                type: "single",
                question: "What does API stand for in programming?",
                options: ["Automated Programming Interface", "Application Programming Interface", "Advanced Program Interaction", "Application Process Integration"],
                correctAnswer: "Application Programming Interface"
            },
            {
                type: "multi",
                question: "Which of the following are JavaScript frameworks? (Select all that apply)",
                options: ["Django", "Angular", "Laravel", "React", "Spring"],
                correctAnswer: ["Angular", "React"]
            }
        ];

        // DOM Elements
        const quizPanel = document.getElementById('quizPanel');
        const startQuizBtn = document.getElementById('startQuiz');
        
        // Current quiz state
        let currentQuestion = 0;
        let score = 0;
        let userAnswers = [];
        let timer;

        // Initialize the quiz
        function initQuiz() {
            quizPanel.innerHTML = '';
            quizPanel.classList.remove('hidden');
            renderQuestion();
            startTimer();
        }

        // Start quiz timer
        function startTimer() {
            let timeLeft = 900; // 15 minutes in seconds
            
            timer = setInterval(() => {
                timeLeft--;
                
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;
                
                // Update timer display
                document.getElementById('timer').innerText = 
                    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                
                if (timeLeft <= 0) {
                    clearInterval(timer);
                    finishQuiz();
                }
            }, 1000);
        }

        // Render current question
        function renderQuestion() {
            const question = quizData[currentQuestion];
            
            const progressPercentage = ((currentQuestion) / quizData.length) * 100;
            
            const questionHTML = `
                <div class="progress-container">
                    <div class="progress-header">
                        <span>Question ${currentQuestion + 1} of ${quizData.length}</span>
                        <span>${Math.round(progressPercentage)}% Complete</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progressPercentage}%"></div>
                    </div>
                </div>
                
                <div class="timer" id="timer">
                    <i class="fas fa-clock"></i>
                    <span>15:00</span>
                </div>
                
                <div class="question-container">
                    <div class="question-number">Question ${currentQuestion + 1}</div>
                    <div class="question-text">${question.question}</div>
                    
                    ${question.type === 'single' ? renderSingleOptions(question) : ''}
                    ${question.type === 'multi' ? renderMultiOptions(question) : ''}
                    ${question.type === 'fill' ? renderFillBlank(question) : ''}
                    
                    <div class="action-buttons">
                        <button class="btn btn-secondary" id="prevBtn" ${currentQuestion === 0 ? 'disabled' : ''}>
                            <i class="fas fa-arrow-left"></i> Previous
                        </button>
                        <button class="btn ${currentQuestion === quizData.length - 1 ? 'btn-success' : 'btn-primary'}" id="nextBtn">
                            ${currentQuestion === quizData.length - 1 ? 'Finish Quiz' : 'Next Question'} 
                            <i class="fas fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
            `;
            
            quizPanel.innerHTML = questionHTML;
            
            // Add event listeners
            document.getElementById('prevBtn').addEventListener('click', goToPreviousQuestion);
            document.getElementById('nextBtn').addEventListener('click', goToNextQuestion);
            
            if (question.type === 'single' || question.type === 'multi') {
                setupOptionSelection();
            }
        }

        // Render single select options
        function renderSingleOptions(question) {
            let optionsHTML = '<div class="options-container">';
            
            question.options.forEach((option, index) => {
                optionsHTML += `
                    <div class="option" data-value="${option}">
                        <input type="radio" name="answer" id="option${index}" value="${option}">
                        <label for="option${index}">${option}</label>
                    </div>
                `;
            });
            
            optionsHTML += '</div>';
            return optionsHTML;
        }

        // Render multi-select options
        function renderMultiOptions(question) {
            let optionsHTML = '<div class="options-container">';
            
            question.options.forEach((option, index) => {
                optionsHTML += `
                    <div class="option" data-value="${option}">
                        <input type="checkbox" name="answer" id="option${index}" value="${option}">
                        <label for="option${index}">${option}</label>
                    </div>
                `;
            });
            
            optionsHTML += '</div>';
            return optionsHTML;
        }

        // Render fill in the blank
        function renderFillBlank(question) {
            return `
                <div class="fill-blank">
                    <input type="text" class="fill-input" id="fillAnswer" placeholder="Type your answer here...">
                </div>
            `;
        }

        // Set up option selection
        function setupOptionSelection() {
            const options = document.querySelectorAll('.option');
            
            options.forEach(option => {
                option.addEventListener('click', function() {
                    const input = this.querySelector('input');
                    
                    if (input.type === 'checkbox') {
                        input.checked = !input.checked;
                        this.classList.toggle('selected', input.checked);
                    } else {
                        // For radio buttons, remove selected from all options
                        options.forEach(opt => opt.classList.remove('selected'));
                        input.checked = true;
                        this.classList.add('selected');
                    }
                });
            });
        }

        // Navigate to previous question
        function goToPreviousQuestion() {
            if (currentQuestion > 0) {
                currentQuestion--;
                renderQuestion();
            }
        }

        // Navigate to next question or finish quiz
        function goToNextQuestion() {
            // Save user answer
            saveAnswer();
            
            if (currentQuestion < quizData.length - 1) {
                currentQuestion++;
                renderQuestion();
            } else {
                clearInterval(timer);
                finishQuiz();
            }
        }

        // Save user's answer
        function saveAnswer() {
            const question = quizData[currentQuestion];
            let userAnswer;
            
            if (question.type === 'single') {
                const selectedOption = document.querySelector('input[name="answer"]:checked');
                userAnswer = selectedOption ? selectedOption.value : null;
            } 
            else if (question.type === 'multi') {
                const selectedOptions = document.querySelectorAll('input[name="answer"]:checked');
                userAnswer = Array.from(selectedOptions).map(option => option.value);
            } 
            else if (question.type === 'fill') {
                userAnswer = document.getElementById('fillAnswer').value.trim();
            }
            
            userAnswers[currentQuestion] = userAnswer;
            
            // Calculate if answer is correct for immediate feedback (optional)
            if (userAnswer) {
                if (question.type === 'single' && userAnswer === question.correctAnswer) {
                    score++;
                } 
                else if (question.type === 'multi' && 
                         arraysEqual(userAnswer.sort(), question.correctAnswer.sort())) {
                    score++;
                }
                else if (question.type === 'fill' && 
                         userAnswer.toLowerCase() === question.correctAnswer.toLowerCase()) {
                    score++;
                }
            }
        }

        // Check if two arrays are equal
        function arraysEqual(a, b) {
            if (a === b) return true;
            if (a == null || b == null) return false;
            if (a.length !== b.length) return false;
            
            for (let i = 0; i < a.length; i++) {
                if (a[i] !== b[i]) return false;
            }
            return true;
        }

        // Finish quiz and show results
        function finishQuiz() {
            const percentage = Math.round((score / quizData.length) * 100);
            
            const resultsHTML = `
                <div class="results-container">
                    <div class="results-icon">
                        ${percentage >= 80 ? '<i class="fas fa-trophy"></i>' : 
                          percentage >= 60 ? '<i class="fas fa-check-circle"></i>' : 
                          '<i class="fas fa-redo-alt"></i>'}
                    </div>
                    
                    <div class="score-text">${score}/${quizData.length}</div>
                    <div class="score-description">
                        ${percentage >= 80 ? 'Excellent work! You have a strong understanding of technology fundamentals.' : 
                          percentage >= 60 ? 'Good job! You have a solid foundation in technology concepts.' : 
                          'Keep learning! Review the material and try again to improve your score.'}
                    </div>
                    
                    <div class="stats-grid">
                        <div class="stat-box">
                            <i class="fas fa-percentage"></i>
                            <div class="value">${percentage}%</div>
                            <div class="label">Overall Score</div>
                        </div>
                        <div class="stat-box">
                            <i class="fas fa-check"></i>
                            <div class="value">${score}</div>
                            <div class="label">Correct Answers</div>
                        </div>
                        <div class="stat-box">
                            <i class="fas fa-times"></i>
                            <div class="value">${quizData.length - score}</div>
                            <div class="label">Incorrect Answers</div>
                        </div>
                    </div>
                    
                    <button class="btn btn-primary" id="reviewBtn" style="margin-bottom: 30px;">
                        <i class="fas fa-list"></i> Review Answers
                    </button>
                    
                    <button class="btn btn-outline" id="restartBtn">
                        <i class="fas fa-redo"></i> Restart Quiz
                    </button>
                    
                    <div class="question-review hidden" id="questionReview">
                        <h3 class="review-title">Question Review</h3>
                        ${renderQuestionReview()}
                    </div>
                </div>
            `;
            
            quizPanel.innerHTML = resultsHTML;
            
            // Add event listeners
            document.getElementById('reviewBtn').addEventListener('click', toggleReview);
            document.getElementById('restartBtn').addEventListener('click', restartQuiz);
        }

        // Toggle question review
        function toggleReview() {
            const reviewSection = document.getElementById('questionReview');
            reviewSection.classList.toggle('hidden');
            
            const reviewBtn = document.getElementById('reviewBtn');
            if (reviewSection.classList.contains('hidden')) {
                reviewBtn.innerHTML = '<i class="fas fa-list"></i> Review Answers';
            } else {
                reviewBtn.innerHTML = '<i class="fas fa-eye-slash"></i> Hide Review';
            }
        }

        // Render question review
        function renderQuestionReview() {
            let reviewHTML = '';
            
            quizData.forEach((question, index) => {
                const userAnswer = userAnswers[index] || 'No answer provided';
                let isCorrect = false;
                
                if (question.type === 'single') {
                    isCorrect = userAnswer === question.correctAnswer;
                } 
                else if (question.type === 'multi') {
                    isCorrect = arraysEqual(
                        Array.isArray(userAnswer) ? userAnswer.sort() : [], 
                        question.correctAnswer.sort()
                    );
                }
                else if (question.type === 'fill') {
                    isCorrect = userAnswer.toLowerCase() === question.correctAnswer.toLowerCase();
                }
                
                reviewHTML += `
                    <div class="review-item">
                        <div class="review-question">
                            <i class="fas ${isCorrect ? 'fa-check-circle correct' : 'fa-times-circle incorrect'}"></i>
                            <span>${question.question}</span>
                        </div>
                        
                        ${!isCorrect ? `
                            <div>
                                <strong>Your answer:</strong>
                                <div class="review-answer user-answer">${formatAnswer(userAnswer)}</div>
                            </div>
                        ` : ''}
                        
                        ${!isCorrect ? `
                            <div style="margin-top: 10px;">
                                <strong>Correct answer:</strong>
                                <div class="review-answer correct-answer">${formatAnswer(question.correctAnswer)}</div>
                            </div>
                        ` : `
                            <div>
                                <strong>Your answer:</strong>
                                <div class="review-answer correct-answer">${formatAnswer(userAnswer)}</div>
                            </div>
                        `}
                    </div>
                `;
            });
            
            return reviewHTML;
        }

        // Format answer for display
        function formatAnswer(answer) {
            if (Array.isArray(answer)) {
                return answer.join(', ');
            }
            return answer;
        }

        // Restart quiz
        function restartQuiz() {
            currentQuestion = 0;
            score = 0;
            userAnswers = [];
            clearInterval(timer);
            initQuiz();
        }

        // Event listeners
        startQuizBtn.addEventListener('click', initQuiz);