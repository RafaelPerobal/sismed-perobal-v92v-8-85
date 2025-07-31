"""
Rota adicional para geração de múltiplas receitas
Integração com a funcionalidade de múltiplas datas
"""

from flask import Blueprint, request
from models import Patient, Prescription, Medicine
from database import db
from utils.api_response import success_response, error_response
from datetime import datetime

multiple_prescriptions_bp = Blueprint('multiple_prescriptions', __name__)

@multiple_prescriptions_bp.route('/prescriptions/multiple', methods=['POST'])
def create_multiple_prescriptions():
    """Criar múltiplas receitas para diferentes datas"""
    try:
        data = request.get_json()
        
        # Validar dados obrigatórios
        if not data or not data.get('pacienteId'):
            return error_response("ID do paciente é obrigatório", 400)
        
        if not data.get('medicamentos'):
            return error_response("Lista de medicamentos é obrigatória", 400)
        
        if not data.get('datas'):
            return error_response("Lista de datas é obrigatória", 400)
        
        # Verificar se o paciente existe
        patient = Patient.query.filter_by(public_id=data['pacienteId']).first()
        if not patient:
            return error_response("Paciente não encontrado", 404)
        
        # Filtrar apenas datas habilitadas
        enabled_dates = [d for d in data['datas'] if d.get('enabled', False)]
        
        if not enabled_dates:
            return error_response("Nenhuma data foi selecionada", 400)
        
        created_prescriptions = []
        
        # Criar uma receita para cada data habilitada
        for date_config in enabled_dates:
            try:
                # Validar formato da data
                prescription_date = datetime.strptime(date_config['date'], '%Y-%m-%d').date()
                
                # Criar nova receita
                prescription = Prescription(
                    patient_id=patient.id,
                    data=prescription_date,
                    observacoes=data.get('observacoes', ''),
                )
                
                # Definir medicamentos (JSON)
                prescription.set_medicamentos(data['medicamentos'])
                
                db.session.add(prescription)
                db.session.flush()  # Para obter o ID
                
                created_prescriptions.append(prescription.to_dict())
                
            except ValueError as ve:
                return error_response(f"Data inválida: {date_config['date']}", 400)
            except Exception as e:
                db.session.rollback()
                return error_response(f"Erro ao criar receita para {date_config['date']}: {str(e)}")
        
        # Confirmar todas as operações
        db.session.commit()
        
        return success_response(
            created_prescriptions,
            f"Criadas {len(created_prescriptions)} receitas com sucesso"
        )
        
    except Exception as e:
        db.session.rollback()
        return error_response(f"Erro ao criar múltiplas receitas: {str(e)}")