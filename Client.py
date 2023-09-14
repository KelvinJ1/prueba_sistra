import socket
from dotenv import load_dotenv
import os
import re
import threading
import time

load_dotenv()

#Accesing venv variables
HOST = os.environ["HOST"] 
PORT = int(os.environ["PORT"])

# Time-out for sync
response_received = threading.Event()

# Capturing servers responses
def receive_messages():
    while (True):
        try:
            data = client_socket.recv(1024)
            if not data:
                break
            print(f'Mensaje del servidor: {data.decode()}')
            #Flagging a response from the server
            response_received.set()
            
        except Exception as e:
            print(f'Error al recibir datos del servidor: {e}')
            break

#try-except 
try:
    # new socket obj
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    # Connect to the server
    client_socket.connect((HOST, PORT))
    print(f'Conectado a {HOST}:{PORT}')

    # Starting thread for servers responses
    receive_thread = threading.Thread(target=receive_messages)
    receive_thread.daemon = True
    receive_thread.start()

    while (True):
        
        format=r'^<\[[0-9A-Fa-f]{4}[01D]]\>$' #format that the msg must follow

        device_number=hex(int(input("\nIngrese el código del equipo en decimal: "))) #device number input and conversion to hex
        device_status=input("¿El equipo está conectado? (1 para conectado, 0 para desconectado, D para eliminar): ") #requestion device status
        msg=f"<[{device_number[2:].zfill(4)}{device_status}]>" #fullfilling msg 
    
        #Validating that the outgoing msg has the required format
        if re.match(format, msg):
            print("\nMensaje enviado: "+msg)
            print("\n**********************************************")
            try:
                # Send data to the server 
                message = msg
                client_socket.sendall(message.encode())

                #awaiting for servers response
                response_received.wait()
                response_received.clear()

            except Exception as e:
                    print(f'Hubo un error al enviar datos al servidor, por favor verifique código fuente: {e}')
        else:
            print("Los datos ingresados no cumplen con el formato.")

    
    
except Exception as e:
    print(f'Al parecer hubo un error en la conexión al servidor, por favor verificar: {e}')
    client_socket.close()



