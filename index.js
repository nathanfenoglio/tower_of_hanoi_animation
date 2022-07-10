//it's working solves the hanoi discs on 3 pegs problem and stores all of the 
//pole states in an array and then animates through them
//to run: npm start
//Serves on port localhost:9966 
class Disc{
    constructor(width_num, disc_color){
        this.width_num = width_num;
        this.disc_color = disc_color;
    }
}

function move(f, t){ //f - from, t - to
	grabbed_disc = discs_on_poles[f].pop();
	discs_on_poles[t].push(grabbed_disc);
	discs_on_poles_at_one_time = [];
	//this is working for getting every time state into an array
	for(let i = 0; i < discs_on_poles.length; i++){
		one_pole_one_time = [];
		for(let j = 0; j < discs_on_poles[i].length; j++){
			one_pole_one_time.push(discs_on_poles[i][j]);
		}
		discs_on_poles_at_one_time.push(one_pole_one_time);
	}
	discs_on_poles_in_time.push(discs_on_poles_at_one_time);

}

function hanoi(n, f, h, t){ //n - # of discs, f - from, h - helper pole (go between), t - to
    //base case
	if(n == 0){ //always recursively calling function with 1 less disc, base case is 0 discs
		return;
	}

    //basically just move twice 
	//from to the helper, then helper to the to
	//recursive call with one less
	//you want to solve the order in the h - helper pole spot for n - 1 discs
	hanoi(n - 1, f, t, h);

    //then you can just move the last disc to the goal target t - to
	//since already solved the order for n - 1 discs at the helper position pole spot
	move(f, t); //the 1st time this returns it's because the subproblem is to just move the 1 disc from the start to the end

    //then move the already solved h - helper pole to the target t - to using the f - from pole as the helper this time
	hanoi(n - 1, h, f, t) //solving the situation with 1 less disc will need to be solved and arranged in the alternating non goal helper pole

}

function draw_one_pole_with_discs(one_poles_disc_arr, pole_num){
	//need to draw the pole itself 1st
	context.fillStyle = 'white';
	context.fillRect((center_of_a_column_x + (pole_num * one_third_of_screen_width)) - horizontal_unit / 4, disc_height, horizontal_unit / 2, disc_height * num_discs, 20);

	//then all of the discs on top of that
    for(let i = 0; i < one_poles_disc_arr.length; i++){
		context.fillStyle = one_poles_disc_arr[i].disc_color;
		center_of_pole = (center_of_a_column_x + (pole_num * one_third_of_screen_width));
		left_correction_to_center_disc_on_pole = (num_discs - one_poles_disc_arr[i].width_num) * (horizontal_unit / 2);
		context.fillRect(center_of_pole - left_correction_to_center_disc_on_pole, canvas.height - (disc_height * (i + 2)), horizontal_unit * (num_discs - one_poles_disc_arr[i].width_num), disc_height, 20);
	}
}


num_discs = 12;

//an array to hold all of the timeline of where the discs are to animate through and animate after all has been calculated
discs_on_poles_in_time = [];

//all 3 of the poles
discs_on_poles = [];
//set up original state with all discs in order on the leftest pole
start_pole = [];
let colors = ['red', 'blue', 'green', 'yellow'];
for(let i = 0; i < num_discs; i++){
	//instantiate all of the discs
	let one_disc = new Disc(i, colors[i % colors.length]);
	start_pole.push(one_disc);
}
discs_on_poles.push(start_pole);
discs_on_poles.push([]);
discs_on_poles.push([]);
discs_on_poles_in_time.push(discs_on_poles);

//function call to solve hanoi discs on 3 poles problem before animating
hanoi(num_discs, 0, 1, 2);

var canvas = document.createElement('canvas');
document.body.appendChild(canvas);

canvas.width = window.screen.width;
canvas.height = window.screen.height;

var context = canvas.getContext('2d');

let divide_t_speed_by = 25;
let speed = 5;
console.log(canvas.width);
console.log(canvas.height);
one_third_of_screen_width = canvas.width / 3;
center_of_a_column_x = one_third_of_screen_width / 2;
disc_height = canvas.height / (num_discs + 2); 
horizontal_unit = one_third_of_screen_width / (num_discs + 1);

console.log(discs_on_poles_in_time); // yup got all of the info
console.log(discs_on_poles_in_time.length);
//let's try to print out the sequence going left to right through the poles...
//you accomplish this with the python version that draws the discs to the console
//f/Python_Code/Messing/recursion_random_stuff python3 hanoi_draw.py

let t = 0;

window.requestAnimationFrame(function loop() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    t = t + 1;
    let t2 = Math.floor(t / divide_t_speed_by) % discs_on_poles_in_time.length;
    console.log(t2);

    //draw each pole with discs
	for(let i = 0; i < 3; i++){
        draw_one_pole_with_discs(discs_on_poles_in_time[t2][i], i);
	}
   
    window.requestAnimationFrame(loop);

})