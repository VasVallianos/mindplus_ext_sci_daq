\
enum PORTS {
    //% block="ALL"
    eALL,
    //% block="Port1"
    ePort1,
	 //% block="Port2"
    ePort2,
	 //% block="Port3"
    ePort3
}

//% color="#679ca3" iconWidth=50 iconHeight=40
namespace sciDAQ{
    //% block="Αρχικοποίηση του sciDAQ " blockType="command" 
    export function sciDaqInit(parameter: any, block: any) {
		if(Generator.board === 'arduino'){
			Generator.addSetup(`Serial.begin(9600);`);
			Generator.addInclude("sciDaqInit", "#include <DFRobot_RP2040_SCI.h>");
			Generator.addObject(`sciDaqInit`,  `DFRobot_RP2040_SCI_IIC`,`sci(0X21, &Wire)`);
			Generator.addSetup(`sci.begin`, `while(sci.begin() != 0){
				Serial.println("SCI DAQ init failed, check wiring!");
				delay(1000);
			}\n\tSerial.println("SCI DAQ initialized!!");`);
			Generator.addSetup(`sci.setPort1`,`sci.setPort1((char *)"Analog");`);
			Generator.addSetup(`sci.setPort2`,`sci.setPort2((char *)"NULL");`);
			Generator.addSetup(`sci.setPort3`,`sci.setPort3((char *)"Null");`);
			Generator.addSetup(`mode0`,`DFRobot_RP2040_SCI_IIC::ePort1IFMode_t mode0 = 0;`);
			Generator.addSetup(`mode23`,`DFRobot_RP2040_SCI_IIC::ePort23Mode_t mode1 = 0, mode2 = 0;`);
			Generator.addSetup(`strings`,`String skuIF0, skuIF1, skuIF2;`);
			Generator.addSetup(`skuIF0`,`skuIF0 = sci.getPort1(&mode0);`);
			Generator.addSetup(`skuIF1`,`skuIF1 = sci.getPort2(&mode1);`);
			Generator.addSetup(`skuIF2`,`skuIF2 = sci.getPort3(&mode2);`);
			Generator.addSetup(`prints`,`Serial.println("Configuration: ");`);
			Generator.addSetup(`prints1`,`Serial.print("IF0: "); Serial.print("TYPE-" + sci.getSensorModeDescribe(mode0) + ' ');Serial.println(" SKU-" + skuIF0);`);
			Generator.addSetup(`prints2`,`Serial.print("IF1: "); Serial.print("TYPE-" + sci.getSensorModeDescribe(mode1) + ' ');Serial.println(" SKU-" + skuIF1);`);
			Generator.addSetup(`prints3`,`Serial.print("IF2: "); Serial.print("TYPE-" + sci.getSensorModeDescribe(mode2) + ' ');Serial.println(" SKU-" + skuIF2);`);
		}
	}
	
	//% block="Διάβασε την τιμή της θερμοκρασίας στην πόρτα [PORT]" blockType="reporter"
	//% PORT.shadow="dropdown" PORT.options="PORTS" PORT.defl="PORTS.eALL"
	//% weight=90
	export function getTempValue(parameter: any, block: any) {
		if(Generator.board === 'arduino'){
			let port = parameter.PORT.code;
			Generator.addCode(`sci.getValue(sci.${port},"Temp_Air").toFloat()`);
		}
	}
	
	//% block="Διάβασε την τιμή της σχετικής υγρασίας στην πόρτα [PORT]" blockType="reporter"
	//% PORT.shadow="dropdown" PORT.options="PORTS" PORT.defl="PORTS.eALL" 
	//% weight=90
	export function getHumValue(parameter: any, block: any) {
		if(Generator.board === 'arduino'){
			let port = parameter.PORT.code;
			Generator.addCode(`sci.getValue(sci.${port},"Humi_Air").toFloat()`);
		}
	}
	
	//% block="Διάβασε την τιμή του ατμοσφαιρικού φωτισμού στην πόρτα [PORT]" blockType="reporter"
	//% PORT.shadow="dropdown" PORT.options="PORTS" PORT.defl="PORTS.eALL" 
	//% weight=90
	export function getAmbLightValue(parameter: any, block: any) {
		if(Generator.board === 'arduino'){
			let port = parameter.PORT.code;
			Generator.addCode(`sci.getValue(sci.${port},"Light").toFloat()`);
		}
	}
	
	//% block="Διάβασε τον δείκτη ποιότητας αέρα AQI στην πόρτα [PORT]" blockType="reporter"
	//% PORT.shadow="dropdown" PORT.options="PORTS" PORT.defl="PORTS.eALL"
	//% weight=90
	export function getAQI(parameter: any, block: any) {
		if (Generator.board === 'arduino') {
			let port = parameter.PORT.code;
			Generator.addCode(`sci.getValue(sci.${port}, "AQI").toInt()`);
		}
	}
	
	//% block="Διάβασε τον δείκτη TVOC σε ppb στην πόρτα [PORT]" blockType="reporter"
	//% PORT.shadow="dropdown" PORT.options="PORTS" PORT.defl="PORTS.eALL"
	//% weight=90
	export function getTVOC(parameter: any, block: any) {
		if (Generator.board === 'arduino') {
			let port = parameter.PORT.code;
			Generator.addCode(`sci.getValue(sci.${port}, "TVOC").toInt()`);
		}
	}

	//% block="Διάβασε τον δείκτη eCO2 σε ppm στην πόρτα [PORT]" blockType="reporter"
	//% PORT.shadow="dropdown" PORT.options="PORTS" PORT.defl="PORTS.eALL"
	//% weight=90
	export function getCO2(parameter: any, block: any) {
		if (Generator.board === 'arduino') {
			let port = parameter.PORT.code;
			Generator.addCode(`sci.getValue(sci.${port}, "ECO2").toInt()`);
		}
	}

	//% block="Διάβασε την περιγραφή του δείκτη ποιότητας αέρα AQI στην πόρτα [PORT]" blockType="reporter"
	//% PORT.shadow="dropdown" PORT.options="PORTS" PORT.defl="PORTS.eALL"
	//% weight=90
	export function getAQIDescription(parameter: any, block: any) {
		if (Generator.board === 'arduino') {
			let port = parameter.PORT.code;
			Generator.addInclude("sci_aqi_desc_fn",
				`String sci_aqi_desc(int aqi) {\n` +
				`  switch (aqi) {\n` +
				`    case 1: return "Εξαιρετική";\n` +
				`    case 2: return "Καλή";\n` +
				`    case 3: return "Μέτρια";\n` +
				`    case 4: return "Κακή";\n` +
				`    case 5: return "Ανθυγιεινή";\n` +
				`    default: return "Αναμονή...";\n` +
				`  }\n` +
				`}`
			);
			Generator.addCode(`sci_aqi_desc(sci.getValue(sci.${port}, "AQI").toInt())`);
		}
	}
	
	//% block="Διάβασε την τιμή του [NAME] στο sciDAQ (επιστρέφει String) στην πόρτα [PORT]" blockType="reporter"
	//% PORT.shadow="dropdown" PORT.options="PORTS" PORT.defl="PORTS.eALL"
	//% NAME.shadow="string" NAME.defl="AQI"
	//% weight=90
	export function getSciValue(parameter: any, block: any) {
		let name = parameter.NAME.code;
		if (Generator.board === 'arduino') {
			let port = parameter.PORT.code;
			Generator.addCode(`sci.getValue(sci.${port}, ${name})`);
		}
	}
}






  
  
