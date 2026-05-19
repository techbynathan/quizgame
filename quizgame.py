#Generative AI (Google Gemini) was used to assist with parts of the code's development#
#and debugging of this project.#

import random


def get_difficulty_settings(level):
    if level == "medium":
        return {"attempts": 15}
    elif level == "hard":
        return {"attempts": 10}
    elif level == "insane":
        return {"attempts": 2}

def select_difficulty():
    while True:
        choice = input("Select difficulty (Medium, Hard, Insane): ").lower()
        if choice in ("medium", "hard", "insane"):
            return choice
        else:
            print("Invalid choice. Please enter 'medium', 'hard', or 'insane'.")

default_questions = [
    {"question": "What is the capital of France?", "choices": ["A) Prague", "B) Berlin", "C) Paris", "D) Madrid"], "answer": "C"},
    {"question": "Which number is even?", "choices": ["A) 3", "B) 7", "C) 9", "D) 8"], "answer": "D"},
    {"question": "What does CPU stand for?", "choices": ["A) Central Processing Unit", "B) Computer Personal Unit", "C) Central Program Utility", "D) Control Processing Unit"], "answer": "A"},
    {"question": "What is the most popular sport in the world?", "choices": ["A) American Football", "B) Basketball", "C) Soccer", "D Baseball" ], "answer": "C"}
]
#The Following Function was created using the assistance of Google's Gemini AI#
def create_custom_questions():
    custom_questions = []
    print("\n--- Custom Question Creator ---")
    while True:
        question_text = input("Enter your question (or type 'done' to finish): ")
        if question_text.lower() == 'done':
            break
        choices = [f"A) {input('Choice A: ')}", f"B) {input('Choice B: ')}", f"C) {input('Choice C: ')}", f"D) {input('Choice D: ')}"]
        answer = input("Enter correct choice (A, B, C, D): ").upper()
        while answer not in ('A', 'B', 'C', 'D'):
            answer = input("Invalid. Enter A, B, C, or D: ").upper()
        custom_questions.append({"question": question_text, "choices": choices, "answer": answer})
    return custom_questions
#End of Function that used Google's Gemini AI#
def select_question_source():
    while True:
        source_choice = input("Use (D)efault or (C)ustom questions? ").lower()
        if source_choice in ('d', 'c'):
            return "default" if source_choice == 'd' else "custom"
        print("Invalid choice.")


def run_quiz_session(question_list, starting_attempts):
    current_score = 0
    attempts_left = starting_attempts
    for q in question_list:
        if attempts_left <= 0:
            print("\nOh no! You have run out of attempts.")
            break
            
        print("\n" + q["question"])
        for choice in q["choices"]:
            print(choice)
            
        user_answer = input("Enter A, B, C, or D: ").upper()
        
        if user_answer == q["answer"]:
            print("Correct!")
            current_score += 1
        else:
            attempts_left -= 1
            print(f"Wrong! Correct answer: {q['answer']}. Attempts left: {attempts_left}")
            
    return current_score


source = select_question_source()
questions_to_use = default_questions if source == "default" else create_custom_questions()

if not questions_to_use:
    print("No questions. Exiting.")
    exit()

random.shuffle(questions_to_use)
difficulty = select_difficulty()
settings = get_difficulty_settings(difficulty)


final_score = run_quiz_session(questions_to_use, settings["attempts"])

print(f"\nQuiz finished! Final score: {final_score}/{len(questions_to_use)}")
