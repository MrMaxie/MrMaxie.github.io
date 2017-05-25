function shuffleArray(o) {
	for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
};

var strings = [
	// C/C++
	'#include <iostream>\n\n' +
	'int main() {\n' +
	'    std::cout << "Hello world";\n' +
	'    return 0;\n' +
	'}',
	// PHP
	'class Greetings {\n' +
	'    protected $name = \'World\';\n' +
	'    function __construct() {\n' +
	'        echo \'Hello \';\n' +
	'    }\n' +
	'    public function who() {\n' +
	'        echo $this->name;\n' +
	'    }\n' +
	'}\n\n' +
	'$g = new Greetings;\n' +
	'$g->who();',
	// Ruby
	'class Greetings\n' +
	'    def initialize\n' +
	'        @name = "World"\n' +
	'        puts "Hello"\n' +
	'    end\n' +
	'    def who\n' +
	'        puts " #{@name}"\n' +
	'    end\n' +
	'end\n\n' +
	'g = Greetings.new\n' +
	'g.who',
	// Python
	'class Greetings:\n' +
	'    def __init__(self):\n' +
	'        self.name = \'World\'\n' +
	'\n' +
	'    def who(self):\n' +
	'        print(\'Hello \' + self.name)\n' +
	'\n' +
	'g = Greetings()\n' +
	'g.who()',
	// JavaScript
	'class Greetings {\n' +
	'    constructor() {\n' +
	'        this.name = [\'World\'];\n' +
	'    }\n' +
	'    function who(cb) {\n' +
	'        for( var i in this.name ){\n' +
	'            console.log("Hello " + this.name[i]);\n' +
	'        }\n' +
	'        cb();\n' +
	'    }\n' +
	'}\n' +
	'var g = new Greetings();\n' +
	'g.who(() => {\n' +
	'    console.log(\'Done!\');\n' +
	'});',
	// C#
	'using System;\n' +
	'\n' +
	'class Greetings {\n' +
	'    static void Main() {\n' +
	'        Console.Write(Concat("Hello", Who()));\n' +
	'    }\n' +
	'    public static string who() {\n' +
	'        return " World";\n' +
	'    }\n' +
	'}'
];


$(document).ready(function(){
	$('#home .code').typed({
		strings: shuffleArray(strings),
		typeSpeed: 25,
		backDelay: 750,
		loop: true,
		loopCount: false,
		contentType: 'text'
	});
});