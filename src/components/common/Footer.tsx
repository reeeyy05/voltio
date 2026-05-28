import { useTranslation } from 'react-i18next';
import { Zap, ShieldCheck, Scale, Cookie } from 'lucide-react';
import { FaXTwitter, FaLinkedinIn, FaGithub } from 'react-icons/fa6';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export function Footer() {
    const { t } = useTranslation();

    return (
        <footer className="bg-stone-100 dark:bg-card border-t border-stone-200 dark:border-border relative z-10 pt-16 pb-8 px-6 md:px-12 mt-auto">
            <div className="max-w-7xl mx-auto">

                <div className="flex flex-col lg:flex-row justify-between gap-12 mb-16">

                    {/* Sección Izquierda: Logotipo y Redes */}
                    <div className="max-w-md">
                        <div className="flex items-center gap-2 mb-6 opacity-90">
                            <div className="bg-primary/10 p-2 rounded-lg">
                                <Zap className="h-8 w-8 text-primary fill-primary/20" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
                                Voltio
                            </span>
                        </div>
                        <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-8">
                            {t('landing.hero_subtitle', 'Gestión operativa avanzada para optimizar el control de obras eléctricas, personal de campo e inventarios en tiempo real.')}
                        </p>
                        <div className="flex items-center gap-4 text-stone-500 dark:text-stone-400">
                            <a href="https://github.com/reeeyy05/Voltio" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors p-2 bg-stone-200/50 dark:bg-stone-800/40 rounded-full">
                                <FaGithub className="h-5 w-5" />
                            </a>
                            <a href="#" className="hover:text-primary transition-colors p-2 bg-stone-200/50 dark:bg-stone-800/40 rounded-full">
                                <FaLinkedinIn className="h-5 w-5" />
                            </a>
                            <a href="#" className="hover:text-primary transition-colors p-2 bg-stone-200/50 dark:bg-stone-800/40 rounded-full">
                                <FaXTwitter className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Sección Derecha: Avisos Legales */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 lg:gap-24">
                        <div>
                            <h4 className="font-bold text-stone-900 dark:text-stone-100 mb-6 uppercase tracking-wider text-sm">
                                {t('footer.legal', 'Legal')}
                            </h4>
                            <ul className="space-y-4 text-sm text-stone-600 dark:text-stone-400 font-medium flex flex-col items-start">

                                {/* MODAL 1: AVISO LEGAL REALISTA */}
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <button className="hover:text-primary transition-colors text-left bg-transparent border-none p-0 cursor-pointer font-medium">
                                            Aviso Legal
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[600px]">
                                        <DialogHeader>
                                            <DialogTitle className="flex items-center gap-2 text-xl font-bold"><Scale className="h-5 w-5 text-primary" /> Aviso Legal</DialogTitle>
                                            <DialogDescription>Términos y condiciones legales de la plataforma Voltio.</DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 text-sm text-stone-700 dark:text-stone-300 leading-relaxed pt-2">
                                            <p className="font-semibold text-stone-900 dark:text-stone-100">1. Datos Identificativos</p>
                                            <p>En cumplimiento con el deber de información recogido en artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico, se reflejan los siguientes datos: la empresa titular de este dominio web es Voltio Tecnologías S.L., con domicilio a estos efectos en Madrid, España, inscrita en el Registro Mercantil de Madrid.</p>
                                            <p className="font-semibold text-stone-900 dark:text-stone-100">2. Usuarios y Condiciones de Uso</p>
                                            <p>El acceso y/o uso de este portal de Voltio atribuye la condición de USUARIO, que acepta, desde dicho acceso y/o uso, las Condiciones Generales de Uso aquí reflejadas. Las citadas Condiciones serán de aplicación independientemente de las Condiciones Generales de Contratación que en su caso resulten de obligado cumplimiento.</p>
                                            <p className="font-semibold text-stone-900 dark:text-stone-100">3. Propiedad Intelectual e Industrial</p>
                                            <p>Voltio Tecnologías S.L. por sí o como cesionaria, es titular de todos los derechos de propiedad intelectual e industrial de su página web, así como de los elementos contenidos en la misma (a título enunciativo, imágenes, sonido, audio, vídeo, software o textos; marcas o logotipos, combinaciones de colores, estructura y diseño, selección de materiales usados, programas de ordenador necesarios para su funcionamiento, acceso y uso, etc.). Todos los derechos reservados.</p>
                                            <p className="font-semibold text-stone-900 dark:text-stone-100">4. Exclusión de Garantías y Responsabilidad</p>
                                            <p>Voltio no se hace responsable, en ningún caso, de los daños y perjuicios de cualquier naturaleza que pudieran ocasionar, a título enunciativo: errores u omisiones en los contenidos, falta de disponibilidad del portal o la transmisión de virus o programas maliciosos o lesivos en los contenidos, a pesar de haber adoptado todas las medidas tecnológicas necesarias para evitarlo.</p>
                                        </div>
                                    </DialogContent>
                                </Dialog>

                                {/* MODAL 2: POLÍTICA DE PRIVACIDAD REALISTA */}
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <button className="hover:text-primary transition-colors text-left bg-transparent border-none p-0 cursor-pointer font-medium">
                                            {t('footer.privacy', 'Política de Privacidad')}
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[600px]">
                                        <DialogHeader>
                                            <DialogTitle className="flex items-center gap-2 text-xl font-bold"><ShieldCheck className="h-5 w-5 text-primary" /> Política de Privacidad</DialogTitle>
                                            <DialogDescription>Tratamiento de datos personales y conformidad RGPD / LOPDGDD.</DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 text-sm text-stone-700 dark:text-stone-300 leading-relaxed pt-2">
                                            <p className="font-semibold text-stone-900 dark:text-stone-100">1. Información al Usuario</p>
                                            <p>Voltio Tecnologías S.L., como Responsable del Tratamiento, le informa que, conforme a lo dispuesto en el Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD), trataremos sus datos personales tal como se detalla en esta política.</p>
                                            <p className="font-semibold text-stone-900 dark:text-stone-100">2. Finalidad del Tratamiento</p>
                                            <p>Los datos recopilados en la plataforma (nombre, apellidos, correo electrónico y credenciales) se procesan con el fin de proporcionar las herramientas de gestión del servicio: control de perfiles y roles operativos, asignación de tareas en proyectos de obras eléctricas, monitorización y trazabilidad del stock de almacén e inventarios, y auditorías internas de seguridad.</p>
                                            <p className="font-semibold text-stone-900 dark:text-stone-100">3. Criterios de Conservación de los Datos</p>
                                            <p>Se conservarán durante el tiempo que dure la relación contractual del servicio o la vigencia de la cuenta corporativa vinculada, y posteriormente durante los plazos legales establecidos para atender posibles responsabilidades administrativas o judiciales.</p>
                                            <p className="font-semibold text-stone-900 dark:text-stone-100">4. Comunicación y Derechos</p>
                                            <p>No se comunicarán los datos a terceros, salvo obligación legal o requerimientos de infraestructura en la nube bajo estrictos acuerdos de confidencialidad. Los usuarios pueden ejercer sus derechos de acceso, rectificación, portabilidad, supresión, limitación y oposición en cualquier momento dirigiéndose al responsable o modificando su información directamente en su panel de perfil.</p>
                                        </div>
                                    </DialogContent>
                                </Dialog>

                                {/* MODAL 3: POLÍTICA DE COOKIES REALISTA */}
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <button className="hover:text-primary transition-colors text-left bg-transparent border-none p-0 cursor-pointer font-medium">
                                            Política de Cookies
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[600px]">
                                        <DialogHeader>
                                            <DialogTitle className="flex items-center gap-2 text-xl font-bold"><Cookie className="h-5 w-5 text-primary" /> Política de Cookies</DialogTitle>
                                            <DialogDescription>Uso de identificadores temporales y almacenamiento técnico.</DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 text-sm text-stone-700 dark:text-stone-300 leading-relaxed pt-2">
                                            <p className="font-semibold text-stone-900 dark:text-stone-100">¿Qué son las Cookies?</p>
                                            <p>Una cookie es un pequeño fichero de texto que se almacena en su navegador al visitar casi cualquier página web. Su utilidad es que la web sea capaz de recordar su visita cuando vuelva a navegar por esa página.</p>
                                            <p className="font-semibold text-stone-900 dark:text-stone-100">Cookies Técnicas Esenciales utilizadas:</p>
                                            <p>Esta plataforma web utiliza de manera exclusiva herramientas técnicas indispensables y almacenamiento local (<code className="px-1 py-0.5 bg-stone-100 dark:bg-stone-800 rounded font-mono text-xs">localStorage</code>) para asegurar la continuidad de los servicios solicitados por el usuario:</p>
                                            <ul className="list-disc pl-5 space-y-2">
                                                <li><b>Token de Autenticación de Sesión:</b> Mantiene de manera cifrada e interna las credenciales de validación del JSON Web Token (JWT) para evitar que el operario tenga que autenticarse continuamente al cambiar de pestaña.</li>
                                                <li><b>Preferencia de Idioma Local:</b> Almacena la configuración seleccionada para el sistema de localización multilingüe (<code className="px-1 py-0.5 bg-stone-100 dark:bg-stone-800 rounded font-mono text-xs">i18nextLng</code>).</li>
                                            </ul>
                                            <p className="font-semibold text-stone-900 dark:text-stone-100">Desactivación de Cookies</p>
                                            <p>Al ser identificadores estrictamente operativos para la autenticación y la funcionalidad básica de la plataforma corporativa, no recopilan información con fines publicitarios o de rastreo comercial. El usuario puede deshabilitarlas configurando las opciones de su navegador de internet, aunque esto podría interrumpir el correcto acceso a las áreas privadas del sistema.</p>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Fila Inferior de Copyright */}
                <div className="border-t border-stone-200 dark:border-border/60 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-stone-500 dark:text-stone-400">
                        © {new Date().getFullYear()} {t('footer.rights', 'Voltio. Todos los derechos reservados.')}
                    </p>
                </div>
            </div>
        </footer>
    );
}