import Text from './Text';
import Caret from './Caret';

export default class Actions{

    constructor(global){
        this.global = global;
        this.global.Actions = this;
        this.actions = Object.assign({}, Text, Caret);
        this.tasks = [];
    }

    dispatch(action){
        
        return new Promise(resolve => {
            if(!action.type){
                console.log('do not specify action type');
                resolve();
            }

            if(!this.actions[action.type]){
                console.log(`action ${action.type} not exist`);
                resolve();
            }
            
            this.tasks.push({
                exe: this.actions[action.type],
                action,
                done: resolve
            });

            if(this.tasks.length >= 1){
                this.run();
            }
        });

    }

    async run(){
        let task = this.tasks.shift();

        if(!task)
            return;

        await task.exe.apply(this, [task.action]);
        task.done();

        await this.run();
    }
}
