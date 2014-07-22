function analyzeThisProjectString(str) {

    this.serializer = new SnapSerializer();
    var project = this.serializer.load(str)


    if (project.sprites['Sprite'] != undefined) {
        //alert('Nice job! "Sprite" is still here');
        alert(project.sprites['Sprite'].isLocked);
    }
    else {
        alert('Where did "Sprite" go?!');
    }

}