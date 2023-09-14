import socket
from dotenv import load_dotenv
import os
import re

load_dotenv()

#Accesing venv variables
HOST = os.environ["HOST"] # Change to the IP address of your Node.js server if it's on a different machine
PORT = int(os.environ["PORT"])

#try-except 
try:
    # Create a socket object
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    # Connect to the server
    client_socket.connect((HOST, PORT))
    print(f'Connected to {HOST}:{PORT}')


    
    loop_status=1
    while (loop_status==1):
        
        format=r'^[0-9A-Fa-f]{4}[01D]$'
        device_number=hex(int(input("\nIngrese el código del equipo en decimal: ")))
        device_status=input("¿El equipo está conectado? (1 para conectado, 0 para desconectado, D para eliminar): ")
        msg=device_number[2:].zfill(4)+device_status
        if re.match(format, msg):
            print("\nMensaje a ser enviado al servidor: "+msg)
            print("\n**********************************************")
            try:
                # Send data to the server 
                message = msg
                client_socket.sendall(message.encode())
            except Exception as e:
                    print(f'Error: {e}')

        else:
            print("Los datos ingresados no cumplen con el formato.")
                        
            


    

    # Receive data from the server
    data = client_socket.recv(1024)
    print(f'Received from server: {data.decode()}')

except Exception as e:
    print(f'Error: {e}')

#loop status =1, will continue requesting data
#loop status = 0, will drop the server.



#client_socket.close()


