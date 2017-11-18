/* eslint no-console:0 */

var Iso8583 = require('../index');
var defineError = require('ut-error').define;
var adiff = require('adiff');

function testDecode(decoder, hex) {
    var msg = decoder.decode(new Buffer(hex, 'hex'));
    console.log(msg);
    return msg;
}

function testEncode(decoder, msg) {
    var buf = decoder.encode(msg).toString('hex');
    console.log(buf);
    return buf;
}

function testDecodeEncode(decoder, hex) {
    var msg = testDecode(decoder, hex);
    var buf = testEncode(decoder, msg);

    console.error('---------------------------------------------');
    console.error(hex);
    console.error(buf);
    console.error('---------------------------------------------');
    if (buf !== hex) {
        console.error(adiff.diff(hex.split(''), buf.split('')));
        console.error('---------------------VS----------------------');
        console.error(adiff.diff(buf.split(''), hex.split('')));
        console.error('---------------------------------------------');
        console.error('Encoded string differs from initial');
    } else {
        console.error('source > destination are identical');
    }
}

var powercard = new Iso8583({
    defineError,
    version: 1,
    fieldFormat: {
        '0': {size: 8, format: 'binary'},
        '1': {size: 8, format: 'binary'},
        '41': {size: 16},
        '52': {size: 16}
    }
});

var postbridge = new Iso8583({
    defineError,
    version: 0,
    fieldFormat: {
        '0': {size: 8, format: 'binary'},
        '1': {size: 8, format: 'binary'},
        '127': {'size': 999999, 'prefixSize': 6}
    }
});

var postilion = new Iso8583({
    defineError,
    version: 0,
    baseEncoding: 'ascii',
    fieldFormat: {
        '0': {size: 8, format: 'binary'},
        '1': {size: 8, format: 'binary'},
        '11': {size: 6, format: 'numeric'},
        '12': {size: 6, format: 'numeric'},
        '56': {'size': 4, 'format': 'string', 'prefixSize': 3},
        '59': {'size': 255, 'format': 'string', 'prefixSize': 3},
        '123': {'size': 15, 'format': 'string', 'prefixSize': 3},
        '127': {'size': 999999, 'prefixSize': 6}
    }
});
var postilion127 = new Iso8583({
    defineError,
    version: 0,
    baseEncoding: 'ascii',
    fieldFormat: {
        'mtid': {size: 0, format: 'string'},
        '0': {size: 16, format: 'string-hexbin'},
        '1': {size: 16, format: 'string-hexbin'},
        '2': {'size': 32, 'format': 'string', 'prefixSize': 2}
    }
});
testDecodeEncode(postilion, '3038303038323338303030303030303030303030303430303030303030303030303030303038313731363137353630323137353630323137353630383138303031');
testDecodeEncode(postilion, '30383130383233383030303030323030303030303034303030303030303030303030303030383138313534383033303030303031303030303031303831383030303031');
testDecodeEncode(postilion, '3032303062323338343438313039653038313230303030303030303030343030303032303338313030303030303030303030303030303038323531353031303134353937393831353031303130383235363031313030303030303636303133303230303036343638373034393631323633313330303720203939393939393030303331333030374B756E646961776120486F74656C2041544D20322020204B756E646961776120202020202020504735393830303431353130303130303634363837303439363132303031303030353337313438303135323131323031323133313434303032');
testDecode(postilion, '303230306330303030303030303030303030303030303030303030303030303030303030313653494D4E4F44455F3030303030313438');
var en = testEncode(postilion, {'mtid': '0200', '3': '382000', '4': '000000000000', '7': '0820141558', '11': '000001', '12': '121212', '13': '0819', '22': '000', '25': '15', '41': '00000001  ', '42': '000000000000067', '43': 'Kundiawa Hotel ATM 2   Kundiawa       PG', '49': '598', '100': '10000000000', '102': '001006144784', '123': '000000000000001'});
testDecode(postilion, en);
testDecodeEncode(postilion, '63303030303030303030303030303030313653494d4e4f44455f3030303030313438');
testDecodeEncode(postilion, '3038303038323338303030303030303030303030303430303030303030303030303030303038323631323036333232323036333232323036333230383236333031');
testDecodeEncode(postbridge, '30323030F23E44D529E08120000000000600002231363438393637382a2a2a2a2a2a32303338343032303130303030303030303130303030303432363035323730383436343033333135323730383034323631363132303432373630313139303130303132433030303030303030433030303030303030303636303133303233323438393637382a2a2a2a2a2a323033383d2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a30303634363934343830353132363233303039332020393939393939303030323330303933534e53204e6f7274682f572041544d2031202020202020506f7274204d6f726573627920202050473539383030343135313030313030363436393434383035313230303130313031343732363031323030313030313236363333383031353231313230313231333134343030323030303638373630314331343230303030303030303031303036343639343438303541544d41707053726320202049434253536e6b3220202020303030363535343634303333564443617264546f74616c73303342535030323539383230313120202020203539384253502020202020323031353034323730303536373231314d65646961546f74616c73333230373c4d65646961546f74616c733e3c546f74616c3e3c416d6f756e743e32353138303030303c2f416d6f756e743e3c43757272656e63793e3539383c2f43757272656e63793e3c4d65646961436c6173733e436173683c2f4d65646961436c6173733e3c2f546f74616c3e3c546f74616c3e3c416d6f756e743e303c2f416d6f756e743e3c43757272656e63793e3030303c2f43757272656e63793e3c4d65646961436c6173733e43617264733c2f4d65646961436c6173733e3c2f546f74616c3e3c2f4d65646961546f74616c733e323138506f7374696c696f6e3a4d657461446174613238373231314d65646961546f74616c733131313231324d6564696142617463684e72313131323236506f7374696c696f6e3a416374697665416374697665446174613131313231344164646974696f6e616c496e666f3131313231324d6564696142617463684e72313732383935353539323236506f7374696c696f6e3a41637469766541637469766544617461323332323233506f7374436172643a50696e42617365645365637572653134747275653231344164646974696f6e616c496e666f333132323c4164646974696f6e616c496e666f3e3c446f776e6c6f61643e3c41544d436f6e66696749443e373337343c2f41544d436f6e66696749443e3c41746d417070436f6e66696749443e373337343c2f41746d417070436f6e66696749443e3c2f446f776e6c6f61643e3c2f4164646974696f6e616c496e666f3e58');
testDecodeEncode(postbridge, '30323130F23E44D52FE18560000000000400002031363438393637382a2a2a2a2a2a30353236333831303030303030303030303030303030303432353231333732393435393739383037333732393034323631393033303432373630313139303130303132433030303030303030433030303030303030303636303133303233323438393637382a2a2a2a2a2a303532363d2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a303030363436383730343936373132363935303031323633313330303720203939393939393030303331333030374b756e646961776120486f74656c2041544d20322020204b756e6469617761202020202020205047393438444154455f54494d457c4143435f4944317c5452414e5f414d4f554e547c4143435f4944327c435552525f434f44457e32303135303432333030303030307c572f44204b756e6469617761204272616e63682041544d20332020207c3030303030303035303030307c445220202020202020202020202020202020202020202020202020207c3539387e32303135303432333030303030307c4253502041544d20436173682057646c2046656520202020202020207c3030303030303030303037357c445220202020202020202020202020202020202020202020202020207c3539387e32303135303432333030303030307c572f44204b756e6469617761204272616e63682041544d20332020207c3030303030303035303030307c445220202020202020202020202020202020202020202020202020207c3539387e32303135303432333030303030307c4253502041544d20436173682057646c2046656520202020202020207c3030303030303030303037357c445220202020202020202020202020202020202020202020202020207c3539387e32303135303432343030303030307c572f44204d5350542d204b616c616b61692054726164696e672020207c3030303030303031323530307c445220202020202020202020202020202020202020202020202020207c3539387e32303135303432343030303030307c4d65726368616e7420454654504f53204665652020202020202020207c3030303030303030303032357c445220202020202020202020202020202020202020202020202020207c3539387e32303135303432343030303030307c572f442054756d692054726164696e672020202020202020202020207c3030303030303031373030307c445220202020202020202020202020202020202020202020202020207c3539387e32303135303432343030303030307c4d65726368616e7420454654504f53204665652020202020202020207c3030303030303030303032357c445220202020202020202020202020202020202020202020202020207c3539387e32303135303432373030303030307c572f44204b756e646961776120486f74656c2041544d2032202020207c3030303030303035303030307c445220202020202020202020202020202020202020202020202020207c3539387e32303135303432373030303030307c4253502041544d20436173682057646c2046656520202020202020207c3030303030303030303037357c445220202020202020202020202020202020202020202020202020207c3539387e353938303430313030313539384330303030303032323133363031303032353938433030303030303232303336303030343135313030313031303030343839363738303130303634363837303439363132303031303030353337313438303135323131323031323133313434303032');
testDecodeEncode(postbridge, '30323030F23E44D529E08120000000000600002231363438393637382a2a2a2a2a2a32303338343032303130303030303030303130303030303432363035323730383436343033333135323730383034323631363132303432373630313139303130303132433030303030303030433030303030303030303636303133303233323438393637382a2a2a2a2a2a323033383d2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a30303634363934343830353132363233303039332020393939393939303030323330303933534e53204e6f7274682f572041544d2031202020202020506f7274204d6f726573627920202050473539383030343135313030313030363436393434383035313230303130313031343732363031323030313030313236363333383031353231313230313231333134343030323030303638373630314331343230303030303030303031303036343639343438303541544d41707053726320202049434253536e6b3220202020303030363535343634303333564443617264546f74616c73303342535030323539383230313120202020203539384253502020202020323031353034323730303536373231314d65646961546f74616c73333230373c4d65646961546f74616c733e3c546f74616c3e3c416d6f756e743e32353138303030303c2f416d6f756e743e3c43757272656e63793e3539383c2f43757272656e63793e3c4d65646961436c6173733e436173683c2f4d65646961436c6173733e3c2f546f74616c3e3c546f74616c3e3c416d6f756e743e303c2f416d6f756e743e3c43757272656e63793e3030303c2f43757272656e63793e3c4d65646961436c6173733e43617264733c2f4d65646961436c6173733e3c2f546f74616c3e3c2f4d65646961546f74616c733e323138506f7374696c696f6e3a4d657461446174613238373231314d65646961546f74616c733131313231324d6564696142617463684e72313131323236506f7374696c696f6e3a416374697665416374697665446174613131313231344164646974696f6e616c496e666f3131313231324d6564696142617463684e72313732383935353539323236506f7374696c696f6e3a41637469766541637469766544617461323332323233506f7374436172643a50696e42617365645365637572653134747275653231344164646974696f6e616c496e666f333132323c4164646974696f6e616c496e666f3e3c446f776e6c6f61643e3c41544d436f6e66696749443e373337343c2f41544d436f6e66696749443e3c41746d417070436f6e66696749443e373337343c2f41746d417070436f6e66696749443e3c2f446f776e6c6f61643e3c2f4164646974696f6e616c496e666f3e58');
testDecodeEncode(postbridge, '30323130F23E44D52FE08560000000000600002031363438393637382a2a2a2a2a2a32303338343032303130303030303030303130303030303432363035323730383436343033333135323730383034323631363132303432373630313139303130303132433030303030303030433030303030303030303636303133303233323438393637382a2a2a2a2a2a323033383d2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a303036343639343438303537313634323330303132363233303039332020393939393939303030323330303933534e53204e6f7274682f572041544d2031202020202020506f7274204d6f72657362792020205047353938303830323030313539384330303030303030303136313832303032353938433030303030303030313631383130303135393843303030303030303134373331313030323539384330303030303030313337333130303431353130303130313030303438393637383031303036343639343438303531323030313031303134373236303132303031303031323636333338303135323131323031323133313434303032');

testDecodeEncode(powercard, '31323130FE776D01AAE0E8000000000000000001313635383932333631323535383736303335333032303030303030303030303030303030303030303030303030303030303030303030303030303030313530363236313430393030303030303031383835363037313530363236313631303030313630323135303632373036323636303131323838323838353131323031303139303431323030303633303033313630363330303331363234353839323336313235353837363033353d3136303231303035313737313434343730333031313131303137303031312020202020202020464142472020202020202020202020343046414247202020202020202020202020202020202020414343524120202020202020204e554c47483933363933363933363130303230313030303030304531304631463839');
testDecodeEncode(powercard, '313830348232018088000000000000000000000131353036323231343039303030303030313530363232313430393035313530363232383031303030303036333030333439303030303030303030303030ffffffffffffffff');
testDecodeEncode(powercard, '31313130FEF76D01AAE0FC0000000000000000013136353839323336313235353837363033353030303030303030303030303030303235303030303030303030303235303030303030303030303235303135303631393134333030303030303030313030303030303031383439363533313530363139313534363031313630323135303632303036313935343131323838323838353130313031323133313443323030303633303033313530363330303331353234353839323336313235353837363033353d313630323130303531373031393834393635333030303831353030303032202020202020202038313530303030323030303120202034304e45585420444f4f522020202020202020202020202020203e4143435241202020202020202047483933363933363933363045333645364246323034364241303731303031303130303030303030323030303032303030433030303030303038383634363338363543363039');
testDecode(postilion, '3032303062323338303438303030653038303030303030303030303031343030303032323338323030303030303030303030303030303038323031343135353830303030303131323132313230383139303030313530303030303030313030303030303030303030303036374B756E646961776120486F74656C2041544D20322020204B756E64696177612020202020202050473539383131313030303030303030303031323030313030363134343738343031353030303030303030303030303030313036383633333033303330333033303330333033303330333033303330333033303330333133363533343934643465346634343435356633303330333033303330333133343338');
testDecode(postilion127, '63303030303030303030303030303030313653494d4e4f44455f3030303030313438');

// {'name':'cbsPost', 'context':'tcp port', 'hostname':'elinw', 'pid':20943, 'level':10, 'message':{'$$':{'opcode':'frameIn', 'frame':'003130383030823800000000000004000000000000003038323731343233353430303233353430303233353430383238303031'}}, 'msg':', 'time':'2015-08-27T14:24:21.116Z', 'v':0}
testDecode(postilion, '30323030B238048000E0800000000000140000223338323030303030303030303030303030303038323031343135353830303030303131323132313230383139303030313530303030303030313030303030303030303030303036374B756E646961776120486F74656C2041544D20322020204B756E6469617761202020202020205047353938313131303030303030303030303132303031303036313434373834303135303030303030303030303030303031303236C000000000000000313653494D4E4F44455F3030303030313438');
testDecode(postilion, '30323030B238048000E0800000000000140000223331323030303030303030303030303030303038323031343135353835A1AA02000031333132313230383238303030313530303030303030313030303030303030303030303036374B756E646961776120486F74656C2041544D20322020204B756E64696177612020202020202050473539383131313030303030303030303031323030313030363134343738343031353030303030303030303030303030313030303032364000000000000000313653494D4E4F44455F3030303030313438');
