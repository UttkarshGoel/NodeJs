/**
 * Created by Uttkarsh on 1/6/2017.
 */
process.stdin.resume();
process.stdin.setEncoding('ascii');

var input_stdin = "";
var input_stdin_array = "";
var input_currentline = 0;

process.stdin.on('data', function (data) {
    input_stdin += data;
});

process.stdin.on('end', function () {
    input_stdin_array = input_stdin.split("\n");
    main();
});

function readLine() {
    return input_stdin_array[input_currentline++];
}

/////////////// ignore above this line ////////////////////

function main() {
    var n_temp = readLine().split(' ');
    var n = parseInt(n_temp[0]);
    var m = parseInt(n_temp[1]);
    a = readLine().split(' ');
    a = a.map(Number);
    b = readLine().split(' ');
    b = b.map(Number);
    var A = a[n-1];
    var B = b[0];
    var counter = 0, number = A; var flag = 0;
    for(var i = 0; i < a.length; i++){
        for(var j = 0; j < b.length; j++){
            while(number <= B){
                if((number%a[i] == 0) && (b[i]%number == 0)){
                    flag = 1;
                }
                else{
                    flag = 0;
                }
                number++;
                if(flag == 1){
                    counter++;
                }
            }
        }
    }
    console.log(counter);
}