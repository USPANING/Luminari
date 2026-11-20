import { useState, useRef } from "react";

const Logo = () => (
	<img
		src='/Logo.svg'
		alt='Luminari Logo'
		style={{
			display: "block",
			margin: "0 auto 20px",
			width: "80px",
			height: "80px",
		}}
	/>
);

export default function AuthScreen({ onLogin, t, language, setLanguage }) {
	const [regError, setRegError] = useState(null);
	const [isLogin, setIsLogin] = useState(true);

	// Registration steps: 0 = Auth, 1 = Transition, 2 = Role, 3 = Details
	const [regStep, setRegStep] = useState(0);

	// Form state
	const [role, setRole] = useState("");
	const [nickname, setNickname] = useState("");
	const [nativeLanguage, setNativeLanguage] = useState("");
	const [profilePic, setProfilePic] = useState(null);

	/// Photo selection menu state
	const [showPhotoMenu, setShowPhotoMenu] = useState(false);

	// Language menu state
	const [showLanguageMenu, setShowLanguageMenu] = useState(false);
	const [langSearch, setLangSearch] = useState("");
	const [program, setProgram] = useState("");
	const [showProgramMenu, setShowProgramMenu] = useState(false);
	const [programSearch, setProgramSearch] = useState("");

	const availablePrograms = [
		{ code: "pl", name: "Polska", flagUrl: "https://flagcdn.com/w80/pl.png" },
	];

	const filteredPrograms = availablePrograms.filter((p) =>
		p.name.toLowerCase().includes(programSearch.toLowerCase()),
	);

	const availableLanguages = [
		{ code: "ru", name: "Русский" },
		{ code: "en", name: "English" },
	];

	const nativeLanguages = [
		{ value: "uk", label: "Українська" },
		{ value: "ru", label: "Русский" },
		{ value: "be", label: "Беларуская" },
		{ value: "ka", label: "ქართული" },
		{ value: "vi", label: "Tiếng Việt" },
		{ value: "tr", label: "Türkçe" },
		{ value: "ar", label: "العربية" },
		{ value: "es", label: "Español" },
		{ value: "en", label: "English" },
	];

	const filteredLanguages = availableLanguages.filter((lang) =>
		lang.name.toLowerCase().includes(langSearch.toLowerCase()),
	);
	const fileInputRef = useRef(null);

	const handleInitialSubmit = (e) => {
		e.preventDefault();
		if (isLogin) {
			onLogin("User", "Student", null);
		} else {
			setRegStep(1);
			setTimeout(() => {
				setRegStep(2);
			}, 2000);
		}
	};

	const handleRoleSelect = (selectedRole) => {
		setRole(selectedRole);
	};

	const handleRoleNext = () => {
		if (role) {
			setRegStep(3);
		}
	};

	const handleFinalSubmit = (e) => {
		e.preventDefault();
		setRegStep(4);
	};

	const handleProgramFinish = async () => {
		if (!program) return;

		try {
			setRegError(null);
			const res = await fetch("/students", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ nickname, nativeLanguage }),
			});
			if (!res.ok) throw new Error("Registration failed");

			const student = await res.json();

			onLogin(student.nickname, role, profilePic, student.id);
		} catch (err) {
			setRegError(err.message);
		}
	};

	const handleFileSelect = (e) => {
		const file = e.target.files[0];
		if (file) {
			const url = URL.createObjectURL(file);
			setProfilePic(url);
			setShowPhotoMenu(false);
		}
	};

	const predefinedColors = [
		"#ff4757",
		"#ffa502",
		"#2ed573",
		"#1e90ff",
		"#3742fa",
		"#ff6348",
	];

	// Render Transition
	if (regStep === 1) {
		return (
			<div
				style={{
					position: "fixed",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
					background: "var(--primary-blue)",
					zIndex: 1000,
					overflow: "hidden",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}>
				<style>{`
          @keyframes scrollText {
            0% { transform: translateY(-100px); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(100vh); opacity: 0; }
          }
        `}</style>
				{[...Array(15)].map((_, i) => (
					<h1
						key={i}
						style={{
							fontSize: "36px",
							color: "rgba(255,255,255,0.3)",
							margin: "15px 0",
							animation: `scrollText 3s linear ${i * 0.15}s infinite`,
						}}>
						{t.welcome}
					</h1>
				))}
			</div>
		);
	}

	// Render Role Selection (Step 2)
	if (regStep === 2) {
		return (
			<div
				className='fade-in'
				style={{
					padding: "40px 30px",
					display: "flex",
					flexDirection: "column",
					height: "100%",
					justifyContent: "center",
				}}>
				<h2
					style={{
						fontSize: "28px",
						marginBottom: "30px",
						textAlign: "center",
					}}>
					{t.whoAreYou}
				</h2>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: "15px",
						flex: 1,
					}}>
					{[
					t.roleElementary, t.roleMiddle, t.roleStudent, t.roleAdult
					].map((r) => (
						<div
							key={r}
							onClick={() => handleRoleSelect(r)}
							className='glass-panel'
							style={{
								padding: "20px",
								textAlign: "center",
								cursor: "pointer",
								border:
									role === r
										? "2px solid var(--primary-cyan)"
										: "1px solid var(--border-glass)",
								background:
									role === r ? "rgba(0, 229, 255, 0.1)" : "var(--bg-glass)",
								transition: "all 0.2s",
							}}>
							<span style={{ fontSize: "18px", fontWeight: "500" }}>{r}</span>
						</div>
					))}
				</div>
				<button
					className='btn-primary'
					onClick={handleRoleNext}
					disabled={!role}
					style={{
						marginTop: "20px",
						opacity: role ? 1 : 0.5,
						transition: "opacity 0.3s",
					}}>
					{t.next}
				</button>
			</div>
		);
	}

	// Render Details & Photo Selection (Step 3)
	if (regStep === 3) {
		return (
			<div
				className='fade-in'
				style={{
					padding: "40px 30px",
					display: "flex",
					flexDirection: "column",
					height: "100%",
					position: "relative",
				}}>
				<h2
					style={{
						fontSize: "26px",
						marginBottom: "20px",
						textAlign: "center",
					}}>
					{t.yourProfile}
				</h2>

				<div
					style={{
						display: "flex",
						justifyContent: "center",
						marginBottom: "30px",
					}}>
					<div
						onClick={() => setShowPhotoMenu(true)}
						style={{
							width: "100px",
							height: "100px",
							borderRadius: "50%",
							backgroundColor:
								profilePic && profilePic.startsWith("#")
									? profilePic
									: "#2a3a5c",
							backgroundImage:
								profilePic && profilePic.startsWith("blob")
									? `url(${profilePic})`
									: "none",
							backgroundSize: "cover",
							backgroundPosition: "center",
							border: "2px dashed var(--primary-cyan)",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							cursor: "pointer",
							position: "relative",
							overflow: "hidden",
						}}>
						{!profilePic && (
							<span style={{ fontSize: "36px", opacity: 0.5 }}>+</span>
						)}
						<div
							style={{
								position: "absolute",
								top: 0,
								left: 0,
								width: "100%",
								height: "100%",
								background: "rgba(0,0,0,0.5)",
								opacity: 0,
								transition: "opacity 0.2s",
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
							}}
							onMouseOver={(e) => (e.currentTarget.style.opacity = 1)}
							onMouseOut={(e) => (e.currentTarget.style.opacity = 0)}>
							<span style={{ fontSize: "14px", fontWeight: "500" }}>
								{t.change}
							</span>
						</div>
					</div>
				</div>

				<form
					onSubmit={handleFinalSubmit}
					style={{ flex: 1, display: "flex", flexDirection: "column" }}>
					<div className='input-group'>
						<label>{t.nickname}</label>
						<input
							type='text'
							className='input-glass'
							value={nickname}
							onChange={(e) => setNickname(e.target.value)}
							required
						/>
					</div>
					<div className='input-group'>
						<label>{t.nativeLanguage}</label>
						<select
							className='input-glass'
							value={nativeLanguage}
							onChange={(e) => setNativeLanguage(e.target.value)}
							required>
							<option
								value=''
								disabled>
								—
							</option>
							{nativeLanguages.map((lang) => (
								<option
									key={lang.value}
									value={lang.value}
									style={{ background: "#1a2233", color: "#ffffff" }}>
									{lang.label}
								</option>
							))}
						</select>
					</div>
					<button
						type='submit'
						className='btn-primary'
						style={{ marginTop: "auto" }}>
						{t.finish}
					</button>
				</form>

				{/* Full-screen Photo Menu */}
				{showPhotoMenu && (
					<div
						className='fade-in'
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							width: "100%",
							height: "100%",
							background: "var(--bg-dark)",
							zIndex: 100,
							padding: "40px 20px",
							display: "flex",
							flexDirection: "column",
						}}>
						<h3
							style={{
								fontSize: "22px",
								marginBottom: "30px",
								textAlign: "center",
							}}>
							{t.editProfilePicture}
						</h3>

						<div
							style={{
								display: "grid",
								gridTemplateColumns: "repeat(3, 1fr)",
								gap: "15px",
							}}>
							{/* Native file upload button */}
							<div
								onClick={() => fileInputRef.current.click()}
								className='glass-panel'
								style={{
									aspectRatio: "1/1",
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									cursor: "pointer",
									flexDirection: "column",
								}}>
								<span style={{ fontSize: "32px", marginBottom: "5px" }}>+</span>
								<span style={{ fontSize: "12px", textAlign: "center" }}>
									{t.gallery}
								</span>
								<input
									type='file'
									accept='image/*'
									ref={fileInputRef}
									onChange={handleFileSelect}
									style={{ display: "none" }}
								/>
							</div>

							{/* Predefined colors */}
							{predefinedColors.map((color) => (
								<div
									key={color}
									onClick={() => {
										setProfilePic(color);
										setShowPhotoMenu(false);
									}}
									style={{
										aspectRatio: "1/1",
										backgroundColor: color,
										borderRadius: "16px",
										cursor: "pointer",
										border: "2px solid rgba(255,255,255,0.2)",
									}}
								/>
							))}
						</div>

						<button
							className='btn-primary'
							onClick={() => setShowPhotoMenu(false)}
							style={{
								marginTop: "auto",
								background: "rgba(255,255,255,0.1)",
							}}>
							{t.cancel}
						</button>
					</div>
				)}
			</div>
		);
	}
	// Render Program Selection (Step 4)
	if (regStep === 4) {
		return (
			<div
				className='fade-in'
				style={{
					padding: "40px 30px",
					display: "flex",
					flexDirection: "column",
					height: "100%",
					justifyContent: "center",
					position: "relative",
				}}>
				<h2
					style={{
						fontSize: "26px",
						marginBottom: "10px",
						textAlign: "center",
					}}>
					{t.chooseProgramTitle}
				</h2>
				<p
					style={{
						color: "var(--text-muted)",
						fontSize: "14px",
						textAlign: "center",
						marginBottom: "30px",
					}}>
					{t.chooseProgramDesc}
				</p>

				<div
					onClick={() => setShowProgramMenu(true)}
					className='glass-panel'
					style={{
						padding: "20px",
						textAlign: "center",
						cursor: "pointer",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						gap: "10px",
					}}>
					{program ? (
						<>
							<span style={{ fontSize: "28px" }}>
								<img
									src={
										availablePrograms.find((p) => p.code === program)?.flagUrl
									}
									alt=''
									style={{
										width: "32px",
										height: "24px",
										objectFit: "cover",
										borderRadius: "4px",
									}}
								/>
							</span>
							<span style={{ fontSize: "18px", fontWeight: "500" }}>
								{availablePrograms.find((p) => p.code === program)?.name}
							</span>
						</>
					) : (
						<span style={{ fontSize: "18px", fontWeight: "500" }}>
							{t.selectProgramBtn}
						</span>
					)}
				</div>

				<button
					className='btn-primary'
					onClick={handleProgramFinish}
					disabled={!program}
					style={{
						marginTop: "30px",
						opacity: program ? 1 : 0.5,
						transition: "opacity 0.3s",
					}}>
					{t.finish}
				</button>

				{regError && (
					<div
						style={{
							color: "#ff8a9a",
							marginTop: "15px",
							textAlign: "center",
						}}>
						{regError}
					</div>
				)}

				{/* Full-screen Country Picker */}
				{showProgramMenu && (
					<div
						className='fade-in'
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							width: "100%",
							height: "100%",
							background: "var(--bg-dark)",
							zIndex: 100,
							padding: "40px 20px",
							display: "flex",
							flexDirection: "column",
						}}>
						<input
							type='text'
							className='input-glass'
							placeholder={t.searchCountry}
							value={programSearch}
							onChange={(e) => setProgramSearch(e.target.value)}
							style={{ marginBottom: "20px" }}
						/>

						<div
							style={{
								display: "grid",
								gridTemplateColumns: "repeat(3, 1fr)",
								gap: "15px",
								overflowY: "auto",
							}}>
							{filteredPrograms.map((p) => (
								<div
									key={p.code}
									onClick={() => {
										setProgram(p.code);
										setShowProgramMenu(false);
									}}
									className='glass-panel'
									style={{
										aspectRatio: "1/1",
										display: "flex",
										flexDirection: "column",
										justifyContent: "center",
										alignItems: "center",
										cursor: "pointer",
										gap: "8px",
										border:
											program === p.code
												? "2px solid var(--primary-cyan)"
												: "1px solid var(--border-glass)",
									}}>
									<img
										src={p.flagUrl}
										alt=''
										style={{
											width: "48px",
											height: "36px",
											objectFit: "cover",
											borderRadius: "6px",
										}}
									/>
									<span style={{ fontSize: "13px", textAlign: "center" }}>
										{p.name}
									</span>
								</div>
							))}
						</div>

						<button
							className='btn-primary'
							onClick={() => setShowProgramMenu(false)}
							style={{
								marginTop: "auto",
								background: "rgba(255,255,255,0.1)",
							}}>
							{t.cancel}
						</button>
					</div>
				)}
			</div>
		);
	}

	// Render Auth Form (Step 0)
	return (
		<div
			style={{
				padding: "60px 30px",
				display: "flex",
				flexDirection: "column",
				height: "100%",
			}}>
			<div
				style={{
					textAlign: "center",
					marginBottom: "40px",
					position: "relative",
				}}>
				<div
					onClick={() => onLogin("Nickname", "Role", null)}
					style={{
						position: "absolute",
						top: "-40px",
						right: "0",
						cursor: "pointer",
						fontSize: "24px",
						opacity: 0.5,
					}}
					title='Пропустить'>
					➔
				</div>
				<div
					onClick={() => setShowLanguageMenu(true)}
					style={{
						position: "absolute",
						top: "-40px",
						left: "0",
						cursor: "pointer",
						fontSize: "22px",
						opacity: 0.7,
						color: "var(--text-main)",
					}}
					title='Zmień język'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						width='22'
						height='22'
						viewBox='0 0 24 24'
						fill='none'
						stroke='currentColor'
						strokeWidth='2'
						strokeLinecap='round'
						strokeLinejoin='round'>
						<path d='M21.54 15H17a2 2 0 0 0-2 2v4.54' />
						<path d='M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17' />
						<path d='M11 21.95V18a2 2 0 0 0-2-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05' />
						<circle
							cx='12'
							cy='12'
							r='10'
						/>
					</svg>
				</div>
				<Logo />
				{showLanguageMenu && (
					<div
						onClick={() => setShowLanguageMenu(false)}
						style={{
							position: "fixed",
							top: 0,
							left: 0,
							width: "100%",
							height: "100%",
							background: "rgba(0,0,0,0.4)",
							backdropFilter: "blur(4px)",
							zIndex: 500,
							display: "flex",
							justifyContent: "flex-end",
						}}>
						<style>{`
            @keyframes slideInPanel {
              0% { transform: translateX(100%); }
              100% { transform: translateX(0); }
            }
          `}</style>
						<div
							onClick={(e) => e.stopPropagation()}
							style={{
								width: "85%",
								height: "100%",
								background: "var(--bg-dark)",
								animation: "slideInPanel 0.3s ease-out",
								padding: "30px 20px",
								display: "flex",
								flexDirection: "column",
								boxShadow: "-10px 0 30px rgba(0,0,0,0.5)",
							}}>
							<div
								style={{
									display: "flex",
									justifyContent: "flex-end",
									marginBottom: "20px",
								}}>
								<span
									onClick={() => setShowLanguageMenu(false)}
									style={{ fontSize: "24px", cursor: "pointer", opacity: 0.7 }}>
									✕
								</span>
							</div>

							<input
								type='text'
								className='input-glass'
								value={langSearch}
								onChange={(e) => setLangSearch(e.target.value)}
								style={{ marginBottom: "20px" }}
							/>

							<div
								style={{
									display: "flex",
									flexDirection: "column",
									gap: "10px",
								}}>
								{filteredLanguages.map((lang) => (
									<div
										key={lang.code}
										onClick={() => {
											setLanguage(lang.code);
											setShowLanguageMenu(false);
										}}
										className='glass-panel'
										style={{
											padding: "16px",
											textAlign: "center",
											cursor: "pointer",
											border:
												language === lang.code
													? "2px solid var(--primary-cyan)"
													: "1px solid var(--border-glass)",
											background:
												language === lang.code
													? "rgba(0, 229, 255, 0.1)"
													: "var(--bg-glass)",
										}}>
										{lang.name}
									</div>
								))}
							</div>
						</div>
					</div>
				)}
				<h1 style={{ fontSize: "32px", marginBottom: "10px" }}>Luminári</h1>
				<p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
					{t.slogan}
				</p>
			</div>

			<div
				style={{
					display: "flex",
					marginBottom: "30px",
					background: "var(--bg-glass)",
					borderRadius: "12px",
					padding: "4px",
					border: "1px solid var(--border-glass)",
				}}>
				<button
					style={{
						flex: 1,
						padding: "10px",
						borderRadius: "10px",
						background: isLogin ? "var(--gradient-btn)" : "transparent",
						color: isLogin ? "white" : "var(--text-muted)",
					}}
					onClick={() => setIsLogin(true)}>
					{t.login}
				</button>
				<button
					style={{
						flex: 1,
						padding: "10px",
						borderRadius: "10px",
						background: !isLogin ? "var(--gradient-btn)" : "transparent",
						color: !isLogin ? "white" : "var(--text-muted)",
					}}
					onClick={() => setIsLogin(false)}>
					{t.register}
				</button>
			</div>

			<div style={{ flex: 1, position: "relative" }}>
				<form
					onSubmit={handleInitialSubmit}
					style={{
						position: "absolute",
						width: "100%",
						transition: "all 0.4s ease",
						opacity: isLogin ? 1 : 0,
						pointerEvents: isLogin ? "all" : "none",
						transform: isLogin ? "translateX(0)" : "translateX(-20px)",
					}}>
					<div className='input-group'>
						<label>{t.email}</label>
						<input
							type='email'
							className='input-glass'
							placeholder='example@mail.com'
							required={isLogin}
						/>
					</div>
					<div className='input-group'>
						<label>{t.password}</label>
						<input
							type='password'
							className='input-glass'
							placeholder='••••••••'
							required={isLogin}
						/>
					</div>
					<button
						type='submit'
						className='btn-primary'
						style={{ marginTop: "20px" }}>
						{t.loginBtn}
					</button>
				</form>

				<form
					onSubmit={handleInitialSubmit}
					style={{
						position: "absolute",
						width: "100%",
						transition: "all 0.4s ease",
						opacity: !isLogin ? 1 : 0,
						pointerEvents: !isLogin ? "all" : "none",
						transform: !isLogin ? "translateX(0)" : "translateX(20px)",
					}}>
					<div className='input-group'>
						<label>{t.email}</label>
						<input
							type='email'
							className='input-glass'
							placeholder='example@mail.com'
							required={!isLogin}
						/>
					</div>
					<div className='input-group'>
						<label>{t.password}</label>
						<input
							type='password'
							className='input-glass'
							placeholder='••••••••'
							required={!isLogin}
						/>
					</div>
					<div className='input-group'>
						<label>{t.repeatPassword}</label>
						<input
							type='password'
							className='input-glass'
							placeholder='••••••••'
							required={!isLogin}
						/>
					</div>
					<button
						type='submit'
						className='btn-primary'
						style={{ marginTop: "20px" }}>
						{t.registerBtn}
					</button>
				</form>
			</div>
		</div>
	);
}
