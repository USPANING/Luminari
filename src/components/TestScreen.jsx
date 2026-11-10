import { useState, useEffect } from "react";

const extractLetter = (optionStr) => {
	if (typeof optionStr !== "string") return optionStr;
	return optionStr.split(".")[0].trim();
};

export default function TestScreen({ przedmiotId, onFinish, onCancel, t }) {
	const [questions, setQuestions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [selectedAnswer, setSelectedAnswer] = useState(null);
	const [answers, setAnswers] = useState([]);

	// Reset state when przedmiotId changes (Bug 2 safeguard)
	useEffect(() => {
		setCurrentIndex(0);
		setSelectedAnswer(null);
		setAnswers([]);
	}, [przedmiotId]);

	useEffect(() => {
		const fetchPath = async () => {
			try {
				setLoading(true);
				const res = await fetch(`/learning-path/${przedmiotId}`);
				if (!res.ok) throw new Error("Failed to fetch path");
				const data = await res.json();

				const flatQuestions = [];
				data.forEach((topic) => {
					if (topic.subtopics) {
						topic.subtopics.forEach((subtopic) => {
							if (subtopic.questions) {
								subtopic.questions.forEach((question) => {
									flatQuestions.push({
										...question,
										topicName: topic.name,
										subtopicName: subtopic.name,
									});
								});
							}
						});
					}
				});
				setQuestions(flatQuestions);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};
		fetchPath();
	}, [przedmiotId]);

	const handleNext = () => {
		if (!selectedAnswer) return;

		const currentQuestion = questions[currentIndex];
		const newAnswers = [
			...answers,
			{ questionId: currentQuestion.id, answer: selectedAnswer },
		];

		if (currentIndex < questions.length - 1) {
			setAnswers(newAnswers);
			setSelectedAnswer(null);
			setCurrentIndex(currentIndex + 1);
		} else {
			onFinish(newAnswers);
		}
	};

	if (loading) {
		return (
			<div
				className='fade-in'
				style={{
					padding: "40px",
					textAlign: "center",
					color: "var(--text-muted)",
					height: "100%",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
				}}>
				{t.loading}
			</div>
		);
	}

	if (error || questions.length === 0) {
		return (
			<div
				className='fade-in'
				style={{
					padding: "40px",
					textAlign: "center",
					height: "100%",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
				}}>
				<p style={{ color: "red", marginBottom: "20px" }}>
					{error || "No questions found."}
				</p>
				<button
					className='btn-primary'
					onClick={onCancel}>
					{t.cancel}
				</button>
			</div>
		);
	}

	const currentQuestion = questions[currentIndex];

	let answersList = currentQuestion.answers;
	if (typeof answersList === "string") {
		try {
			answersList = JSON.parse(answersList);
		} catch (e) {
			answersList = [];
		}
	}

	return (
		<div
			className='fade-in'
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				width: "100%",
				height: "100%",
				background: "var(--bg-dark)",
				zIndex: 1000,
				display: "flex",
				flexDirection: "column",
				padding: "20px",
			}}>
			{/* Header */}
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					marginBottom: "30px",
				}}>
				<div
					onClick={onCancel}
					style={{
						cursor: "pointer",
						opacity: 0.7,
						padding: "10px",
						marginLeft: "-10px",
					}}>
					✕
				</div>
				<div
					style={{
						fontSize: "16px",
						fontWeight: "500",
						color: "var(--text-muted)",
					}}>
					{currentIndex + 1} / {questions.length}
				</div>
				<div style={{ width: "30px" }}></div>
			</div>

			{/* Progress bar */}
			<div
				style={{
					height: "4px",
					background: "var(--bg-glass)",
					borderRadius: "2px",
					marginBottom: "30px",
					overflow: "hidden",
				}}>
				<div
					style={{
						height: "100%",
						width: `${((currentIndex + 1) / questions.length) * 100}%`,
						background: "var(--primary-cyan)",
						transition: "width 0.3s ease",
					}}
				/>
			</div>

			<div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
				{/* Context (topic/subtopic) */}
				{currentQuestion.topicName && (
					<div
						style={{
							fontSize: "14px",
							color: "var(--primary-cyan)",
							marginBottom: "10px",
							fontWeight: "500",
						}}>
						{currentQuestion.topicName} › {currentQuestion.subtopicName}
					</div>
				)}

				{/* Question Text */}
				<h2
					style={{ fontSize: "22px", lineHeight: "1.4", marginBottom: "40px" }}>
					{currentQuestion.content}
				</h2>

				{/* Answers */}
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: "12px",
						marginBottom: "auto",
						overflowY: "auto",
					}}>
					{answersList &&
						answersList.map((ans, idx) => {
							const letter = extractLetter(ans);
							return (
								<div
									key={idx}
									onClick={() => setSelectedAnswer(letter)}
									className='glass-panel'
									style={{
										padding: "20px",
										cursor: "pointer",
										border:
											selectedAnswer === letter
												? "2px solid var(--primary-cyan)"
												: "1px solid var(--border-glass)",
										background:
											selectedAnswer === letter
												? "rgba(0, 229, 255, 0.1)"
												: "var(--bg-glass)",
										transition: "all 0.2s",
									}}>
									{ans}
								</div>
							);
						})}
				</div>

				{/* Next/Finish Button */}
				<button
					className='btn-primary'
					onClick={handleNext}
					disabled={!selectedAnswer}
					style={{
						marginTop: "30px",
						marginBottom: "20px",
						opacity: selectedAnswer ? 1 : 0.5,
						transition: "opacity 0.3s",
						flexShrink: 0,
					}}>
					{currentIndex < questions.length - 1 ? t.nextQuestion : t.finishTest}
				</button>
			</div>
		</div>
	);
}
