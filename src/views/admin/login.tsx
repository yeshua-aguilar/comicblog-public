import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import type { AuthError } from 'firebase/auth';
import { auth } from '../../services/firebase';
import '../../assets/css/login.css';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Por favor, completa tu correo y contraseña.');
      return;
    }

    try {
      setSubmitting(true);
      
      // Autenticación con Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log('Usuario autenticado:', user);
      
      // Guardar token si "Recuérdame" está marcado
      if (remember) {
        localStorage.setItem('rememberUser', 'true');
      }
      
      // Redirigir al panel de administración
      navigate('/admin/dashboard'); // Ajusta la ruta según tu aplicación
      
    } catch (error) {
      const authError = error as AuthError;
      
      // Manejar diferentes tipos de errores de Firebase
      switch (authError.code) {
        case 'auth/user-not-found':
          setError('No existe una cuenta con este correo electrónico.');
          break;
        case 'auth/wrong-password':
          setError('Contraseña incorrecta.');
          break;
        case 'auth/invalid-email':
          setError('El formato del correo electrónico no es válido.');
          break;
        case 'auth/user-disabled':
          setError('Esta cuenta ha sido deshabilitada.');
          break;
        case 'auth/too-many-requests':
          setError('Demasiados intentos fallidos. Intenta más tarde.');
          break;
        default:
          setError('Error al iniciar sesión. Intenta nuevamente.');
          console.error('Error de autenticación:', authError);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-bg d-flex align-items-center justify-content-center min-vh-100 py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8 col-xl-5">
            <div className="card login-card border-0 shadow-lg overflow-hidden">
              <div className="row g-0">
                <div className="col-12">
                  <div className="p-4 p-md-5">
                    <div className="text-center mb-4">
                      <Link to="/" className="text-decoration-none">
                        <span className="display-6 fw-bold brand-title">Comic<span className="text-danger">Flix</span> <span className="text-muted fs-5">Admin</span></span>
                      </Link>
                      <p className="text-white mt-2 mb-0">Accede al panel administrativo</p>
                    </div>

                    {error && (
                      <div className="alert alert-danger py-2" role="alert">
                        {error}
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                      <div className="form-floating mb-3">
                        <input
                          type="email"
                          className="form-control bg-dark text-white border-secondary"
                          id="email"
                          placeholder=" "
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                        <label htmlFor="email" className="text-muted">Correo electrónico</label>
                      </div>

                      <div className="mb-3 position-relative">
                        <div className="form-floating">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            className="form-control bg-dark text-white border-secondary pe-5"
                            id="password"
                            placeholder=" "
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                          <label htmlFor="password" className="text-muted">Contraseña</label>
                        </div>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary toggle-password px-2 py-1"
                          style={{ fontSize: '0.9rem', height: '2.2rem', minWidth: '70px' }}
                          onClick={() => setShowPassword((s) => !s)}
                          aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        >
                          {showPassword ? 'Ocultar' : 'Mostrar'}
                        </button>
                      </div>

                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="remember"
                            checked={remember}
                            onChange={(e) => setRemember(e.target.checked)}
                          />
                          <label className="form-check-label text-white" htmlFor="remember">
                            Recuérdame
                          </label>
                        </div>
                        <Link to="#" className="link-secondary small text-decoration-none">¿Olvidaste tu contraseña?</Link>
                      </div>

                      <button type="submit" className="btn btn-danger w-100 py-2 fw-semibold shadow-sm" disabled={submitting}>
                        {submitting ? (
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        ) : null}
                        {submitting ? 'Ingresando...' : 'Ingresar'}
                      </button>
                    </form>

                    <div className="text-center mt-4">
                      <small className="text-white">
                        ¿Volver al sitio?{' '}
                        <Link to="/" className="link-light text-decoration-none">Ir al inicio</Link>
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-3">
              <small className="text-white">© {new Date().getFullYear()} ComicFlix • Área Administrativa</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;