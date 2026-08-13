import React, { useState } from 'react';
import { ShieldCheck, Loader2, AlertCircle, Eye, EyeOff, Save } from 'lucide-react';
import CryptoJS from 'crypto-js';
import { usuarioService } from '../services/usuarioService';
import { useToast } from '../context/ToastContext';

interface ModalRedefinirSenhaProps {
    userId: number;
    onSuccess: () => void;
}

const ModalRedefinirSenha: React.FC<ModalRedefinirSenhaProps> = ({ userId, onSuccess }) => {
    const { showToast } = useToast();
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [senhaVisivel, setSenhaVisivel] = useState(false);
    const [confirmarSenhaVisivel, setConfirmarSenhaVisivel] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!senha || !confirmarSenha) {
            setError('Por favor, preencha todos os campos.');
            return;
        }

        if (senha.length < 6) {
            setError('A nova senha deve conter no mínimo 6 caracteres.');
            return;
        }

        if (senha !== confirmarSenha) {
            setError('As senhas digitadas não conferem.');
            return;
        }

        setIsLoading(true);

        try {
            const hashedSenha = CryptoJS.MD5(senha).toString().toUpperCase();

            // 1. Atualiza apenas a senha via endpoint dedicado (evita 422 do schema completo)
            const senhaResult = await usuarioService.atualizarSenha(userId, hashedSenha);

            if (!senhaResult.success) {
                let msgErro = 'Erro ao redefinir sua senha.';
                const rawMsg: any = senhaResult.message;
                if (rawMsg) {
                    if (typeof rawMsg === 'string') {
                        msgErro = rawMsg;
                    } else if (Array.isArray(rawMsg)) {
                        msgErro = rawMsg.map((e: any) => {
                            const campo = e.loc?.[e.loc.length - 1] || 'campo';
                            return `${campo}: ${e.msg}`;
                        }).join(' | ');
                    } else if (typeof rawMsg === 'object') {
                        msgErro = JSON.stringify(rawMsg);
                    }
                }
                setError(msgErro);
                setIsLoading(false);
                return;
            }

            // 2. Zera o flag altera_senha para o usuário não ser obrigado a trocar novamente
            try {
                const uRes = await usuarioService.getItemById(userId);
                if (uRes.success && uRes.data) {
                    const data = uRes.data;
                    const strOr = (v: any) => (v == null ? '' : String(v));
                    const payload: any = {
                        id: data.id,
                        login: strOr(data.login),
                        senha: hashedSenha,
                        nome: strOr(data.nome),
                        email: strOr(data.email),
                        ativo: data.ativo || 'S',
                        nivel_acesso: data.nivel_acesso || 'N',
                        altera_senha: 'N',
                        cpf: strOr(data.cpf).replace(/\D/g, ''),
                        numero_whats: strOr(data.numero_whats).replace(/\D/g, ''),
                        processado_skw: data.processado_skw || 'N',
                        processado_sav: data.processado_sav || 'N',
                        excluido: data.excluido || 'N',
                        id_sav_adm_departamento: data.id_sav_adm_departamento === 0 ? null : data.id_sav_adm_departamento,
                        id_sav_adm_empresa: data.id_sav_adm_empresa === 0 ? null : data.id_sav_adm_empresa,
                        id_sav_adm_unidresp: data.id_sav_adm_unidresp === 0 ? null : data.id_sav_adm_unidresp,
                        id_sav_adm_perfil: data.id_sav_adm_perfil === 0 ? null : data.id_sav_adm_perfil,
                        naturalidade: strOr(data.naturalidade),
                        autorizante: data.autorizante || 'N',
                        assinatura: strOr(data.assinatura),
                        usa_2fa: data.usa_2fa || 'S'
                    };

                    if (data.datahora_cadastro) {
                        payload.datahora_cadastro = data.datahora_cadastro;
                    }

                    await usuarioService.updateUsuario(userId, payload);
                }
            } catch (syncErr) {
                console.error('Aviso: senha atualizada, mas falha ao sincronizar altera_senha:', syncErr);
            }

            showToast('Sua senha foi redefinida com sucesso!', 'success');
            localStorage.setItem('sav_altera_senha', 'N');
            onSuccess();
        } catch (err) {
            console.error('Erro na redefinição de senha obrigatória:', err);
            setError('Ocorreu um erro inesperado ao salvar a senha.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/45 backdrop-blur-[1px] font-sans">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md mx-4 p-8 flex flex-col items-center">
                
                {/* Ícone Informativo */}
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                     style={{ backgroundColor: 'rgba(118, 201, 110, 0.1)' }}>
                    <ShieldCheck size={32} style={{ color: '#76c96e' }} />
                </div>

                <h3 className="text-xl font-bold text-slate-800 text-center tracking-tight mb-2">
                    Redefinição de Senha Obrigatória
                </h3>
                <p className="text-sm text-slate-500 text-center leading-relaxed mb-6">
                    O administrador solicitou que você altere sua senha no próximo acesso. Por favor, cadastre uma nova senha para continuar usando o sistema.
                </p>

                <form onSubmit={handleSubmit} className="w-full space-y-4">
                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100 animate-in fade-in slide-in-from-top-1">
                            <AlertCircle size={14} className="shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Nova Senha */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                            Nova Senha
                        </label>
                        <div className="flex gap-2">
                            <input
                                type={senhaVisivel ? 'text' : 'password'}
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                disabled={isLoading}
                                placeholder="Mínimo 6 caracteres"
                                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-corp-teal focus:bg-white transition-colors"
                            />
                            <button
                                type="button"
                                onClick={() => setSenhaVisivel(!senhaVisivel)}
                                disabled={isLoading}
                                className="shrink-0 flex items-center justify-center p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-xl border border-slate-200 transition-colors"
                            >
                                {senhaVisivel ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Confirmar Nova Senha */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                            Confirmar Nova Senha
                        </label>
                        <div className="flex gap-2">
                            <input
                                type={confirmarSenhaVisivel ? 'text' : 'password'}
                                value={confirmarSenha}
                                onChange={(e) => setConfirmarSenha(e.target.value)}
                                disabled={isLoading}
                                placeholder="Repita a nova senha"
                                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-corp-teal focus:bg-white transition-colors"
                            />
                            <button
                                type="button"
                                onClick={() => setConfirmarSenhaVisivel(!confirmarSenhaVisivel)}
                                disabled={isLoading}
                                className="shrink-0 flex items-center justify-center p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-xl border border-slate-200 transition-colors"
                            >
                                {confirmarSenhaVisivel ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{ backgroundColor: '#76c96e' }}
                        className="w-full py-3 rounded-xl text-white font-semibold hover:opacity-95 transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                <span>Salvando senha...</span>
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                <span>Salvar Nova Senha</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ModalRedefinirSenha;
