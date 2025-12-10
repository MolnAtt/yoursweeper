import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer


class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"] # kiszedi a consumers.py-ban room_name-nek nevezett változó értékét és elmenti
        self.room_group_name = f"chat_{self.room_name}" # bevezet egy csoportnevet ez alapján

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]

        # Itt a lényeg, itt most a message változó = a nyers bejövő információ!
        # Itt kell kezdened ezzel valamit...
        # ...

        



        # ...
        # és ha készen vagy  ezzel, akkor kiértesíthetsz mindenkit 
        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name, {"type": "chat.message", "message": message}
        )

    # Receive message from room group
    def chat_message(self, event):
        message = event["message"]

        # Send message to WebSocket
        self.send(text_data=json.dumps({"message": message}))

class JatekConsumer(WebsocketConsumer):
    def connect(self):
        self.jatekid = self.scope["url_route"]["kwargs"]["jatekid"] # kiszedi a consumers.py-ban room_name-nek nevezett változó értékét és elmenti
        self.jateknev = f"jatek_{self.jatekid}" # bevezet egy csoportnevet ez alapján

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.jateknev, self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.jateknev, self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data):
        szotar = json.loads(text_data)

        if 'message' in szotar:
            async_to_sync(self.channel_layer.group_send)(
                self.jateknev, 
                {
                    'type': 'kuld_uzenet', # ez mondja meg, hogy melyik küldőmetódus legyen használva!
                    'message': szotar['message'],
                }
            )

        if 'jatek_allapot_update' in szotar:
            async_to_sync(self.channel_layer.group_send)(
                self.jateknev, 
                {
                    'type': 'kuld.allapot', 
                    'jatek_allapot_update': szotar['jatek_allapot_update'],
                }
            )

        if  'kattintott_mezo_x' in szotar and 'kattintott_mezo_y' in szotar and 'felderitesek' in szotar:
            async_to_sync(self.channel_layer.group_send)(
                self.jateknev, 
                {
                    'type': 'kuld.cselekves', 
                    'kattintott_mezo_x': szotar['kattintott_mezo_x'],
                    'kattintott_mezo_y': szotar['kattintott_mezo_y'],
                    'felderitesek': szotar['felderitesek'],
                }
            ) 
    
    
    # küldő metódusok!
    def kuld_uzenet(self, event):
        self.send(text_data=json.dumps({
            "message": event["message"],
            }))

    def kuld_allapot(self, event):
        self.send(text_data=json.dumps({
            'jatek_allapot_update': event['jatek_allapot_update'],
        }))

    def kuld_cselekves(self, event):
        self.send(text_data=json.dumps({
            'kattintott_mezo_x': event['kattintott_mezo_x'],
            'kattintott_mezo_y': event['kattintott_mezo_y'],
            'felderitesek': event['felderitesek'],
        }))