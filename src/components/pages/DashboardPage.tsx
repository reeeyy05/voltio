import { useAuthStore } from "@/stores/authStore";
import { useAdminStore } from "@/stores/adminStore";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, HardHat, CheckCircle2, TrendingUp, Clock, Zap } from "lucide-react";
import { useEffect } from "react";

export default function DashboardPage() {
    const { perfil, rol } = useAuthStore();
    const { usuarios, fetchUsuarios } = useAdminStore();
    const { t } = useTranslation();

    useEffect(() => {
        if (rol === 'admin') fetchUsuarios();
    }, [rol, fetchUsuarios]);

    if (rol === 'admin') {
        return (
            <div className="p-6 space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100">{t('dashboard.admin_title')}</h1>
                    <p className="text-stone-500 mt-1">{t('dashboard.admin_subtitle', { name: perfil?.nombre })}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-stone-200 dark:border-stone-800 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">{t('dashboard.registered_users')}</CardTitle>
                            <Users className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{usuarios.length}</div>
                            <p className="text-xs text-stone-500 mt-1">{t('dashboard.users_trend')}</p>
                        </CardContent>
                    </Card>

                    <Card className="border-stone-200 dark:border-stone-800 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">{t('dashboard.active_works')}</CardTitle>
                            <HardHat className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">12</div>
                            <p className="text-xs text-stone-500 mt-1">{t('dashboard.works_trend')}</p>
                        </CardContent>
                    </Card>

                    <Card className="border-stone-200 dark:border-stone-800 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">{t('dashboard.system_load')}</CardTitle>
                            <Zap className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">98%</div>
                            <p className="text-xs text-stone-500 mt-1">{t('dashboard.load_trend')}</p>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-stone-200 dark:border-stone-800">
                    <CardHeader>
                        <CardTitle>{t('dashboard.activity_title')}</CardTitle>
                        <CardDescription>{t('dashboard.activity_desc')}</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-end gap-2 px-6">
                        {[40, 70, 55, 90, 65, 80, 45].map((height, i) => (
                            <div key={i} className="flex-1 bg-primary/20 hover:bg-primary transition-colors rounded-t-sm" style={{ height: `${height}%` }}></div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-8">
            <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-2xl">
                    <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100">{t('dashboard.emp_title', { name: perfil?.nombre })}</h1>
                    <p className="text-stone-500 mt-1">{t('dashboard.emp_subtitle')}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-stone-900 text-white border-none shadow-lg overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <CheckCircle2 className="h-16 w-16" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-stone-400 text-xs uppercase tracking-wider">{t('dashboard.completed_tasks')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold">24</div>
                    </CardContent>
                </Card>

                <Card className="border-stone-200 dark:border-stone-800 shadow-sm">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-xs uppercase text-stone-500">{t('dashboard.pending_tasks')}</CardTitle>
                        <Clock className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-stone-800 dark:text-stone-100">5</div>
                    </CardContent>
                </Card>

                <Card className="border-stone-200 dark:border-stone-800 shadow-sm">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-xs uppercase text-stone-500">{t('dashboard.assigned_works')}</CardTitle>
                        <HardHat className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-stone-800 dark:text-stone-100">3</div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}