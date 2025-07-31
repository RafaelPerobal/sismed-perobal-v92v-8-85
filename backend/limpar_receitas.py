
"""
Script de Limpeza Automática de Receitas - SisMed Perobal v9.0
Remove todas as receitas do sistema mantendo pacientes e medicamentos
"""

import os
import sqlite3
from datetime import datetime

def limpar_receitas():
    """
    Remove todas as receitas do banco de dados
    Mantém intactos: pacientes, medicamentos
    """
    db_path = 'sismed_v9.db'
    
    try:
        # Verificar se o banco existe
        if not os.path.exists(db_path):
            print("✅ Banco de dados não encontrado - nada para limpar")
            return
        
        # Conectar ao banco
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Contar receitas antes da limpeza
        cursor.execute("SELECT COUNT(*) FROM prescriptions")
        count_before = cursor.fetchone()[0]
        
        # Limpar todas as receitas
        cursor.execute("DELETE FROM prescriptions")
        
        # Resetar auto-increment
        cursor.execute("DELETE FROM sqlite_sequence WHERE name='prescriptions'")
        
        # Confirmar mudanças
        conn.commit()
        
        print(f"🧹 Limpeza concluída: {count_before} receitas removidas")
        print(f"📊 Pacientes e medicamentos preservados")
        print(f"⏰ Executado em: {datetime.now().strftime('%d/%m/%Y às %H:%M:%S')}")
        
    except Exception as e:
        print(f"❌ Erro durante a limpeza: {str(e)}")
        return False
    
    finally:
        if 'conn' in locals():
            conn.close()
    
    return True

if __name__ == "__main__":
    print("🚀 Iniciando limpeza automática de receitas...")
    limpar_receitas()
    print("✅ Limpeza finalizada")
