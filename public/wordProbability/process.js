function sort(data){
    let EC = [],EA = [], PC=[], PA=[];
    data.map(d=>{
        switch(d.category){
            case 'EC':
                EC.push(d);
                break;
            case 'EA':
                EA.push(d);
                break;
            case 'PC':
                PC.push(d)
                break;
            case 'PA':
                PA.push(d);
                break;
            default:
        }
    });
    return {
        EA: EA,
        EC: EC,
        PC: PC,
        PA: PA
    }
}

function locate(d){
    let transform;
    switch(d){
            case 'EC':
                transform = `translate(${width/4},${3*height/4})`;
                break;
            case 'EA':
                transform = `translate(${width/4},${height/4})`;
                break;
            case 'PC':
                transform = `translate(${3*width/4},${3*height/4})`;
                break;
            case 'PA':
                transform = `translate(${3*width/4},${height/4})`;
                break;
            default:
        }
    return transform;
}