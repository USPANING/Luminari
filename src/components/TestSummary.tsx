import { useState, useEffect } from "react";
interface Answer {
	questionId: number;
	answer: string;
}
interface TestSummaryProps {
	answers: Answer[];
	userId: number;
	onClose: () => void;
	t: Record<string, string>;
}

interface TestResult {
	percent: number;
  wrongAnswers: Answer[];
	correct: number;
	total: number;
}
export default function TestSummary({
	answers,
	userId,
	onClose,
	t,
}: TestSummaryProps) {
	const [result, setResult] = useState<TestResult | null>(null);
	const [loadingResult, setLoadingResult] = useState(true);
	const [resultError, setResultError] = useState<string | null>(null);

	const [explanation, setExplanation] = useState<string | null>(null);
	const [loadingExplanation, setLoadingExplanation] = useState(false);
	const [explanationError, setExplanationError] = useState<string | null>(null);

	useEffect(() => {
		const fetchResult = async () => {
			try {
				setLoadingResult(true);
				const res = await fetch("/test/result", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						studentId: userId,
             answers: answers
					}),
				});
				if (!res.ok) throw new Error("Failed to submit test");
				const data = await res.json();
				setResult(data);
			} catch (err) {
				err instanceof Error ? setResultError(err.message) : setResultError("Unknown Error");
			} finally {
				setLoadingResult(false);
			}
		};
		fetchResult();
	}, [answers, userId]);

	const handleExplain = async () => {
		try {
			setLoadingExplanation(true);
			setExplanationError(null);

			const mistakes = (result?.wrongAnswers || []).map((wa) => ({
				questionId: wa.questionId,
				answer: wa.answer,
			}));

			const res = await fetch("/ai/explain", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					studentId: userId,
					mistakes,
				}),
			});
			if (!res.ok) throw new Error("Failed to generate explanation");
			const data = await res.json();
			setExplanation(data.explanation);
		} catch (err) {
			err instanceof Error ? setExplanationError(err.message) : setExplanationError("Unknown Error");
		} finally {
			setLoadingExplanation(false);
		}
	};

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
				overflowY: "auto",
			}}>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					marginBottom: "30px",
				}}>
				<div
					onClick={onClose}
					style={{
						cursor: "pointer",
						opacity: 0.7,
						padding: "10px",
						marginLeft: "-10px",
					}}>
					✕
				</div>
				<div style={{ fontSize: "18px", fontWeight: "600" }}>{t.results}</div>
				<div style={{ width: "30px" }}></div>
			</div>

			<div
				style={{
					flex: 1,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}>
				{loadingResult && (
					<div style={{ margin: "auto", color: "var(--text-muted)" }}>
						{t.loading}
					</div>
				)}

				{resultError && (
					<div style={{ margin: "auto", color: "red" }}>
						{resultError || t.error}
					</div>
				)}

				{result && (
					<div
						className='fade-in'
						style={{
							width: "100%",
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							marginTop: "20px",
						}}>
						<div
							style={{
								width: "140px",
								height: "140px",
								borderRadius: "50%",
								background: "var(--bg-glass)",
								border: "4px solid var(--primary-cyan)",
								display: "flex",
								flexDirection: "column",
								justifyContent: "center",
								alignItems: "center",
								marginBottom: "30px",
								boxShadow: "0 0 20px rgba(0, 229, 255, 0.2)",
							}}>
							<span
								style={{
									fontSize: "36px",
									fontWeight: "700",
									color: "var(--primary-cyan)",
								}}>
								{result.percent}%
							</span>
						</div>

						<div
							className='glass-panel'
							style={{ width: "100%", padding: "20px", marginBottom: "30px" }}>
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									marginBottom: "15px",
								}}>
								<span style={{ color: "var(--text-muted)" }}>{t.correct}:</span>
								<span style={{ fontWeight: "600" }}>{result.correct}</span>
							</div>
							<div style={{ display: "flex", justifyContent: "space-between" }}>
								<span style={{ color: "var(--text-muted)" }}>{t.total}:</span>
								<span style={{ fontWeight: "600" }}>{result.total}</span>
							</div>
						</div>

						{!explanation && !loadingExplanation && (
							<button
								className='btn-primary'
								onClick={handleExplain}
								style={{
									background: "linear-gradient(135deg, #8a2be2, #4a00e0)",
									border: "none",
								}}>
								✨ {t.explainMistakes}
							</button>
						)}

						{loadingExplanation && (
							<div
								style={{
									margin: "20px 0",
									color: "var(--text-muted)",
									display: "flex",
									alignItems: "center",
									gap: "10px",
								}}>
								<span
									style={{
										display: "inline-block",
										animation: "spin 1s linear infinite",
									}}>
									⏳
								</span>
								{t.generatingExplanation}
							</div>
						)}

						{explanationError && (
							<div style={{ color: "red", marginTop: "20px" }}>
								{explanationError || t.error}
							</div>
						)}

						{explanation && (
							<div
								className='fade-in glass-panel'
								style={{
									width: "100%",
									padding: "20px",
									marginTop: "10px",
									textAlign: "left",
								}}>
								<h3
									style={{
										fontSize: "18px",
										marginBottom: "15px",
										color: "var(--primary-cyan)",
									}}>
									✨ AI Explanation
								</h3>
								<div
									style={{
										fontSize: "15px",
										lineHeight: "1.6",
										whiteSpace: "pre-wrap",
										color: "var(--text-main)",
									}}>
									{explanation}
								</div>
							</div>
						)}
					</div>
				)}
			</div>

			{result && (
				<button
					className='btn-primary'
					onClick={onClose}
					style={{ marginTop: "30px", flexShrink: 0 }}>
					{t.finish}
				</button>
			)}

			<style>{`
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
		</div>
	);
}
