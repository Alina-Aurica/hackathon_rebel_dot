from application.dto.message_for_translate_dto import MessageForTranslateDTO
from application.externalAPI.openAI import translate_message
from application.model.models import MessageForTranslate
from application.repository.message_for_translate_repository import MessageForTranslateRepository


class MessageForTranslateService:
    @staticmethod
    def create_message(**data):
        message_DTO = MessageForTranslateDTO()
        message_data = message_DTO.load(data)

        translated_message = translate_message(message_data.get('original_message'),
                                            message_data.get('target_language'))

        message_new = MessageForTranslate(id_sender=message_data.get('id_sender'),
                                          id_receiver=message_data.get('id_sender'),
                                          original_message=message_data.get('original_message'),
                                          translated_message=translated_message,
                                          source_language=message_data.get('source_language'),
                                          target_language=message_data.get('target_language')
                                          )

        return MessageForTranslateRepository.add_message(message_new)


