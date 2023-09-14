const net = require('net');

// creating server instance
const server = net.createServer((socket) => {
    console.log('Cliente conectado');


    // devices obj
    const devices = {}
    // format to be followed by the msgs
    const format =/^<\[([0-9A-F0-9A-Fa-f]{4}[01D1])\]>$/; 
    
    // if there is incoming data from the client prints the incoming msg
    socket.on('data', (data) => {
        try {
            console.log(`\nData proveniente del cliente: ${data}`);
            console.log("*************************************************\n");
            // forming a string with the incoming data and removing whitespaces
            const incoming_code= data.toString().trim(); 
            if (format.test(incoming_code)) {
                const converted_code= incoming_code.replace(/[<>\[\]]/g, '');
                const device_number= parseInt(converted_code.slice(0,4) ,16);
                const device_status=converted_code.slice(-1);
    
                // if the incoming device number is already in the devices obj will execute an action based on the status
                if(devices[device_number]){
                        if (device_status==="D") {
                            delete devices[device_number];
                            console.log(`\nEl dispositivo (${device_number}) ha sido eliminado del registro.`);
                            socket.write(`\nDispositivo (${device_number}) eliminado.`);
                        }
                        else if (devices[device_number].status==="1" && device_status==="1") {
                            console.log(`\nEl dispositivo (${device_number}) ya se encuentra conectado (${device_status}).`);
                            socket.write(`\nEl estado del dispositivo ya era conectado (1)`);
                        } 
                        else if(devices[device_number].status==="0" && device_status==="0"){
                                console.log(`\nEl dispositivo (${device_number}) ya se encuentra desconectado (${device_status}).`);
                                socket.write(`\nEl estado del dispositivo ya era desconectado(0)`);
                        }
                        else if(devices[device_number].status!==device_status){
                            devices[device_number].status = device_status;
                            console.log(`\nEl estado del dispositivo (${device_number}) ha sido actualizado a (${device_status}).`);
                            socket.write(`\nEl estado del dispositivo (${device_number}) ha sido actualizado`);
                        }
                        
                        
                }else if(!devices[device_number] && device_status==="D"){
                    console.log("\nEste dispositivo no se puede eliminar ya que no existe.")
                    socket.write(`\nEste dispositivo no se puede eliminar ya que no existe.`);
    
                }
                else{
                    devices[device_number]={number:device_number, status: device_status}
                    console.log("\nNuevo dispositivo añadido")
                    socket.write(`\nDispositivo agregado al registro`);
                } 
                const deviceList = Object.keys(devices).map(deviceKey => `${devices[deviceKey].number}: ${devices[deviceKey].status}`).join(', ');
                console.log(`\nLista de dispositivos en el registro: ${deviceList}`);  
                
            }
            
        } catch (error) {
            console.error(`Error al tratar la data proveniente del cliente: ${error}`);            
        }

    });

    // If client loses cnxn
    socket.on('end', () => {
        console.log('Cliente desconectado');
    });

    //handling error if cnxn fails
    socket.on('error', (err) => {
        console.error(`Error en conexión: ${err}`);
    });
});

// active on port:
const PORT = 3000; 


server.listen(PORT, () => {
    console.log(`\nServer escuchando en el puerto: ${PORT}`);
});
