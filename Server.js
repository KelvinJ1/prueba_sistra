const net = require('net');

const server = net.createServer((socket) => {
    console.log('Cliente conectado');



    const devices = {}
    const format =/^[0-9A-F0-9A-Fa-f]{4}[01D1]$/;   
    socket.on('data', (data) => {
        console.log(`\nReceived data: ${data}`);
        console.log("*************************************************\n");
        const incoming_code= data.toString().trim();
        
        if (format.test(incoming_code)) {
            const device_number= parseInt(incoming_code.slice(0,4) ,16);
            const device_status=incoming_code.slice(-1);

            if(devices[device_number]){
                 // Device already exists, update device_status
                    
                    if (device_status==="D") {
                        delete devices[device_number];
                        console.log(`\nEl dispositivo ${device_number} ha sido eliminado del registro.`)                        
                    }
                    else if (devices[device_number].status==="1" && device_status==="1") {
                        console.log(`\nEl dispositivo ${device_number} ya se encuentra conectado (${device_status}).`);
                    } 
                    else if(devices[device_number].status==="0" && device_status==="0"){
                            console.log(`\nEl dispositivo ${device_number} ya se encuentra desconectado (${device_status}).`);
                    }
                    else if(devices[device_number].status!==device_status){
                        devices[device_number].status = device_status;
                        console.log(`\nEl estado del dispositivo ${device_number} ha sido actualizado a (${device_status}).`);
                    }
                    
                    
            }else if(!devices[device_number] && device_status==="D"){
                console.log("\nEste dispositivo no se puede eliminar ya que no existe.")

            }
            else{
                devices[device_number]={number:device_number, status: device_status}
                console.log("\nNuevo dispositivo añadido")
            } 
            const deviceList = Object.keys(devices).map(deviceKey => `${devices[deviceKey].number}: ${devices[deviceKey].status}`).join(', ');
            console.log(`\nLista de dispositivos en el registro: ${deviceList}`);  
            
        }
        
        // You can send a response to the client here if needed.
    });

    socket.on('end', () => {
        console.log('Cliente desconectado');
    });

    socket.on('error', (err) => {
        console.error(`Error: ${err}`);
    });
});

const PORT = 3000; // Change this to your desired port number

server.listen(PORT, () => {
    console.log(`\nServer escuchando en el puerto: ${PORT}`);
});
