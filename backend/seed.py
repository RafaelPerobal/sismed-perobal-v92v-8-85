
"""
Script de inicialização do banco de dados
Popula tabela de medicamentos com lista padrão oficial atualizada
"""

from app import create_app
from database import db
from models import Medicine
import json

# Lista oficial atualizada de 36 medicamentos especializados - Perobal PR
MEDICAMENTOS_OFICIAIS_PEROBAL = [
    {"denominacao": "AMITRIPTILINA", "concentracao": "25MG", "apresentacao": "COMPRIMIDO"},
    {"denominacao": "ÁCIDO VALPROICO", "concentracao": "250MG", "apresentacao": "COMPRIMIDO"},
    {"denominacao": "ÁCIDO VALPROICO", "concentracao": "500MG", "apresentacao": "COMPRIMIDO"},
    {"denominacao": "ÁCIDO VALPROICO", "concentracao": "50MG/ML", "apresentacao": "SUSPENSÃO ORAL"},
    {"denominacao": "BIPERIDENO CLORIDRATO", "concentracao": "2MG", "apresentacao": "COMPRIMIDO"},
    {"denominacao": "CARBAMAZEPINA", "concentracao": "200MG", "apresentacao": "COMPRIMIDO"},
    {"denominacao": "CARBAMAZEPINA", "concentracao": "20MG/ML", "apresentacao": "SUSPENSÃO"},
    {"denominacao": "CARBONATO DE LÍTIO", "concentracao": "300MG", "apresentacao": "COMPRIMIDO"},
    {"denominacao": "CLOMIPRAMINA CLORIDRATO", "concentracao": "25MG", "apresentacao": "COMPRIMIDO"},
    {"denominacao": "CLONAZEPAM", "concentracao": "2MG", "apresentacao": "COMPRIMIDO"},
    {"denominacao": "CLONAZEPAM", "concentracao": "2.5MG/ML", "apresentacao": "SOLUÇÃO ORAL"},
    {"denominacao": "CLORPROMAZINA CLORIDRATO", "concentracao": "25MG", "apresentacao": "COMPRIMIDO"},
    {"denominacao": "CLORPROMAZINA CLORIDRATO", "concentracao": "100MG", "apresentacao": "COMPRIMIDO"},
    {"denominacao": "DESVENLAFAXINA SUCCINATO", "concentracao": "50MG", "apresentacao": "COMPRIMIDO"},
    {"denominacao": "DIAZEPAM", "concentracao": "5MG", "apresentacao": "COMPRIMIDO"},
    {"denominacao": "DIAZEPAM", "concentracao": "10MG", "apresentacao": "COMPRIMIDO"},
    {"denominacao": "ESCITALOPRAM", "concentracao": "10MG", "apresentacao": "COMPRIMIDO"},
    {"denominacao": "FENITOÍNA SÓDICA", "concentracao": "100MG", "apresentacao": "COMPRIMIDO"},
    {"denominacao": "FENOBARBITAL", "concentracao": "100MG", "apresentacao": "COMPRIMIDO"},
    {"denominacao": "FENOBARBITAL", "concentracao": "40MG/ML", "apresentacao": "SOLUÇÃO ORAL"},
    {"denominacao": "FLUOXETINA", "concentracao": "20MG", "apresentacao": "CÁPSULA/COMPRIMIDO"},
    {"denominacao": "HALOPERIDOL", "concentracao": "1MG", "apresentacao": "COMPRIMIDO"},
    {"denominacao": "HALOPERIDOL", "concentracao": "5MG", "apresentacao": "COMPRIMIDO"},
    {"denominacao": "HALOPERIDOL", "concentracao": "2MG/ML", "apresentacao": "SOLUÇÃO ORAL"},
    {"denominacao": "HALOPERIDOL DECANOATO", "concentracao": "50MG/ML", "apresentacao": "SOLUÇÃO INJETÁVEL"},
    {"denominacao": "IMIPRAMINA CLORIDRATO", "concentracao": "25MG", "apresentacao": "COMPRIMIDO"},
    {"denominacao": "LEVOMEPROMAZINA", "concentracao": "25MG", "apresentacao": "COMPRIMIDO"},
    {"denominacao": "LEVOMEPROMAZINA", "concentracao": "100MG", "apresentacao": "COMPRIMIDO"},
    {"denominacao": "MIRTAZAPINA", "concentracao": "30MG", "apresentacao": "COMPRIMIDO"},
    {"denominacao": "NORTRIPTILINA CLORIDRATO", "concentracao": "25MG", "apresentacao": "COMPRIMIDO"},
    {"denominacao": "OXCARBAZEPINA", "concentracao": "600MG", "apresentacao": "COMPRIMIDO"},
    {"denominacao": "OXCARBAZEPINA", "concentracao": "60MG/ML", "apresentacao": "SOLUÇÃO ORAL"},
    {"denominacao": "PAROXETINA CLORIDRATO", "concentracao": "20MG", "apresentacao": "COMPRIMIDO"},
    {"denominacao": "PREGABALINA", "concentracao": "75MG", "apresentacao": "COMPRIMIDO"},
    {"denominacao": "SERTRALINA CLORIDRATO", "concentracao": "50MG", "apresentacao": "COMPRIMIDO"},
    {"denominacao": "VENLAFAXINA CLORIDRATO", "concentracao": "75MG", "apresentacao": "COMPRIMIDO"}
]

def seed_medicines():
    """Popula tabela de medicamentos com dados oficiais de Perobal"""
    app = create_app()
    
    with app.app_context():
        print("🌱 Iniciando seed de medicamentos oficiais - Perobal PR...")
        
        # Verificar se já existem medicamentos
        existing_count = Medicine.query.count()
        if existing_count > 0:
            print(f"ℹ️  Já existem {existing_count} medicamentos cadastrados")
            print("🔄 Atualizando lista com medicamentos oficiais...")
            # Opcional: limpar medicamentos existentes para atualizar
            # Medicine.query.delete()
            # db.session.commit()
        
        # Inserir medicamentos oficiais
        inserted = 0
        updated = 0
        
        for med_data in MEDICAMENTOS_OFICIAIS_PEROBAL:
            try:
                # Verificar se já existe (evitar duplicatas)
                existing = Medicine.query.filter_by(
                    denominacao_generica=med_data["denominacao"],
                    concentracao=med_data["concentracao"],
                    apresentacao=med_data["apresentacao"]
                ).first()
                
                if not existing:
                    medicine = Medicine(
                        denominacao_generica=med_data["denominacao"],
                        concentracao=med_data["concentracao"],
                        apresentacao=med_data["apresentacao"]
                    )
                    db.session.add(medicine)
                    inserted += 1
                else:
                    # Atualizar dados se necessário
                    existing.denominacao_generica = med_data["denominacao"]
                    existing.concentracao = med_data["concentracao"]
                    existing.apresentacao = med_data["apresentacao"]
                    updated += 1
            
            except Exception as e:
                print(f"❌ Erro ao processar {med_data['denominacao']}: {e}")
                continue
        
        # Commit todas as inserções/atualizações
        try:
            db.session.commit()
            print(f"✅ {inserted} medicamentos inseridos, {updated} atualizados com sucesso!")
            print(f"📋 Total de medicamentos oficiais: {len(MEDICAMENTOS_OFICIAIS_PEROBAL)}")
            print("🏥 Lista oficial da Secretaria Municipal de Saúde de Perobal - PR")
        except Exception as e:
            db.session.rollback()
            print(f"❌ Erro ao salvar medicamentos: {e}")

def clear_and_reseed():
    """Limpa a tabela e reinsere todos os medicamentos oficiais"""
    app = create_app()
    
    with app.app_context():
        print("🗑️  Limpando tabela de medicamentos...")
        Medicine.query.delete()
        db.session.commit()
        
        print("🔄 Reinserindo medicamentos oficiais...")
        seed_medicines()

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == "--reset":
        clear_and_reseed()
    else:
        seed_medicines()
