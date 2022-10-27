export class CircleProgress{
    constructor(obj){
        this.radius = obj.radius;
        this.value = obj.value;
        this.maxValue = obj.maxValue;
        this.width = obj.width;
        this.color = obj.color;
        this.backgroundColor = obj.backgroundColor;
        this.text = obj.text;
        this.canvas = document.createElement('canvas');
        this.init();
    }
    div(){
        let div = document.createElement('div');
        div.appendChild(this.canvas);
        div.classList.add('circle-progress');
        div.classList.add('module');
        return div;
    }
    draw(){
        //tant que le dessin dépasse de la canvas, on réduit la taille et la police
        let i = 0;
        while(this.canvas.width < this.radius*2.3){
            this.radius--;
            if(this.width > this.radius/3){
                this.width--;
            }    
        }
        let ctx = this.canvas.getContext('2d');
        ctx.lineCap = 'round';
        let x = this.canvas.width / 2;
        let y = this.canvas.height / 2;
        let radius = this.radius;
        let endPercent = this.value / this.maxValue;
        let curPerc = 0;
        let counterClockwise = false;
        let circ = Math.PI * 2;
        let quart = Math.PI / 2;
        let animation = setInterval(function () {
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, circ, false);
            ctx.strokeStyle = this.backgroundColor;
            ctx.lineWidth = this.width;
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(x, y, radius, -(quart), ((circ) * curPerc) - quart, false);
            ctx.lineWidth = this.width-3;
            // If we've defined a gradient, use it
            ctx.strokeStyle = this.color;
            ctx.stroke();
            if (curPerc < endPercent) {
                curPerc += 0.01;
            }
            else {
                clearTimeout(animation);
            }
            //if text and he have a \n
            if (this.text && this.text(this.value).indexOf('\n') != -1) {
                let text = this.text(this.value).split('\n');
                ctx.font = `bold ${this.radius / 4}px sans-serif`;
                ctx.fillStyle = '#000';
                ctx.textAlign = 'center';
                //draw texts line by line with a 10px offset between them in the middle of the canvas
                for (let i = 0; i < text.length; i++) {
                    ctx.fillText(text[i], this.canvas.width / 2, this.canvas.height / 2 + (i * 20));
                }

            }
            else if (this.text) {
                ctx.font = `bold ${this.radius / 2}px sans-serif`;
                ctx.fillStyle = '#000';
                ctx.textAlign = 'center';
                ctx.fillText(this.text(this.value), x, y + this.radius / 4);
            }


        
        }.bind(this), 10);
        //write the text at the center
    }
    init(){
        this.canvas.width = 150;
        this.canvas.height = 150;
        this.draw();
    }
}