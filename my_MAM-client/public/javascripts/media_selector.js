var project;
var binselected = 0;
var uid = 0;

if (Cookies.get('project')){
    project = JSON.parse(Cookies.get('project'));
    Cookies.set('project', project, {maxAge: 300000});
}
else{
    project = {type: 'project'};
    Cookies.set('project', project, {maxAge: 300000});
}
/**
 * Set a deep property on nested objects
 * @param  {object}   obj  A object
 * @param  {String}   path A path
 * @param  {Any}      val  Anything that can be set
 * @author Victor B. https://gist.github.com/victornpb/4c7882c1b9d36292308e
 */
function setDeepVal(obj, path, val) {
    var props = path.split('.');
    for (var i = 0, n = props.length - 1; i < n; ++i) {
        obj = obj[props[i]] = obj[props[i]] || {};
    }
    obj[props[i]] = val;
    return obj;
}

function deleteInProject(json, key_to_skip) {
    var json_string = JSON.stringify(json);
    return JSON.parse(json_string, function (key, value) {
        if (key !== key_to_skip) {
            return value;
        }
    });    
}

function reconstructProject(project, parent_id=undefined){
    for (var key in project){
        var projectkey = project[key];
        if(typeof projectkey === 'object'){
            var uid = projectkey['uid'];
            var path = projectkey['path'];
            var name = projectkey['name'];
            var level = projectkey['level'];
            var indent = String(level * 10);
            if (projectkey['type'] === 'file'){
                if (level === 0){
                $(".project-list").append('<dt class="file" level="'+level+'" id="'+uid+'">'+
                                                '<img src="/img/document.gif" width="15" height="17" style="padding-left:'+indent+'px;">'+name+
                                                '<button type="button" class="deleteButton" name="'+uid+'">&#10006;</button>'+
                                            '</dt>');
                }else{
                    $("#"+parent_id).after('<dt class="file" level="'+level+'" id="'+uid+'">'+
                                                '<img src="/img/document.gif" width="15" height="17" style="padding-left:'+indent+'px;">'+name+
                                                '<button type="button" class="deleteButton" name="'+uid+'">&#10006;</button>'+
                                            '</dt>');
                }
            }
            else if (projectkey['type'] === 'folder'){
                if (level === 0){
                    $(".project-list").append(  '<div>'+
                                                    '<dt class="bin" level="'+level+'" name="'+name+'" id="'+uid+'" path="'+path+'">'+
                                                        '<img src="/img/folder.gif" width="15" height="17" style="padding-left:'+indent+'px;">'+name+
                                                        '<button type="button" class="deleteButton" name="'+uid+'">&#10006;</button>'+
                                                    '</dt>'+
                                                '</div>');
                }else{
                    $("#"+parent_id).after(  '<div>'+
                                                '<dt class="bin" level="'+level+'" name="'+name+'" id="'+uid+'" path="'+path+'">'+
                                                    '<img src="/img/folder.gif" width="15" height="17" style="padding-left:'+indent+'px;">'+name+
                                                    '<button type="button" class="deleteButton" name="'+uid+'">&#10006;</button>'+
                                                '</dt>'+
                                            '</div>');
                }
                level += 1;
                reconstructProject(projectkey, uid);
            }
        }
    }
};

$( document ).ready(function(){
    reconstructProject(project);
});

$( document ).ready(function(){
    $("img").click(function(){
        var id = $(this).attr("id");
        var url = '"/src/Thumbnails/'+id+'.png"'
        $("#my-player").attr("poster", "/src/Thumbnails/"+id+".png");
        $("#video_asset").attr("src", "src/Proxys/"+id+".mp4");
        $("#my-player_html5_api").attr("poster", "/src/Thumbnails/"+id+".png");
        $("#my-player_html5_api").attr("src", "src/Proxys/"+id+".mp4");
        $(".vjs-poster").attr("style", "background-image: url("+url+");");
    });
});

$( document ).ready(function(){
    $(".checkBox").click(function() {
        $(this).prop('checked', $(this).prop('checked'));
    });

    $("#SelectAll").click(function(){
        $(".checkBox").prop('checked', true)
    });

    $("#DeselectAll").click(function(){
        $(".checkBox").prop('checked', false)
    });

    $("#AddSelected").click(function(){
        $(".checkBox:checked").each(function(){
            var id = $(this).attr("id");
            var name = $(this).attr("name");
            var level = $(".selected").attr('level');
            var path = $(".selected").attr('path');
            var indent;

            if (level === undefined){
                level = 0;
            }
            else{
                level = Number(level) + 1;
                indent = String(level * 10);
            }
            if (path === undefined){
                if (name !==""){
                    $(".project-list").append('<dt class="file" level="'+level+'" id="'+uid+'">'+
                                            '<img src="/img/document.gif" width="15" height="17" style="padding-left:'+indent+'px;">'+name+
                                            '<button type="button" class="deleteButton" name="'+uid+'">&#10006;</button>'+
                                        '</dt>');
                    project[uid] = {id: id, type:'file', name:name, level:level, indent:indent, uid:uid};
                    uid += 1;
                }
            }
            else{
                path += "."+uid;
                if (name !==""){
                    $(".selected").after('<dt class="file" level="'+level+'" id="'+uid+'">'+
                                            '<img src="/img/document.gif" width="15" height="17" style="padding-left:'+indent+'px;">'+name+
                                            '<button type="button" class="deleteButton" name="'+uid+'">&#10006;</button>'+
                                        '</dt>');
                    setDeepVal(project, path, {id: id, type:'file', name:name, level:level, indent:indent, uid:uid});
                    uid += 1;
                }
            }
        })
        $(".checkBox").prop('checked', false);
        $(".bin").removeAttr("style").removeClass("selected");
        $("#AddSelected").text('Add to project');
        binselected -= 1;
        Cookies.set('project', project, {maxAge: 300000});
    });
});

$( document ).ready(function(){
    $("#AddBin").click(function(){
        var name = $("#BinName").val();
        var level = $(".selected").attr('level');
        var path = $(".selected").attr('path');
        if (level === undefined){
            level = 0;
        }
        else{
            level = Number(level) + 1;
            var indent = String(level * 10);
        }
        if (path === undefined){
            path = uid;
            if (name !==""){
                $(".project-list").append(  '<div>'+
                                                '<dt class="bin" level="'+level+'" name="'+name+'" id="'+uid+'"  path="'+path+'">'+
                                                    '<img src="/img/folder.gif" width="15" height="17" style="padding-left:'+indent+'px;">'+name+
                                                    '<button type="button" class="deleteButton" name="'+uid+'">&#10006;</button>'+
                                                '</dt>'+
                                            '</div>');
                project[uid]={type:'folder', name:name, path:path, level:level, indent:indent, uid:uid};
                uid += 1;
            }
        }
        else{
            path += "."+uid;
            if (name !==""){
                $(".selected").after('<div>'+
                                        '<dt class="bin" level="'+level+'" name="'+name+'" id="'+uid+'"  path="'+path+'">'+
                                            '<img src="/img/folder.gif" width="15" height="17" style="padding-left:'+indent+'px;">'+name+
                                            '<button type="button" class="deleteButton" name="'+uid+'">&#10006;</button>'+
                                        '</dt>'+
                                    '</div>');
                setDeepVal(project, path, {type:'folder', name:name, path:path, level:level, indent:indent, uid:uid});
                uid += 1;
            }
        }
        Cookies.set('project', project, {maxAge: 300000});
    });

    $("#DownloadProject").click(function(){
        var data = JSON.stringify(project);
        var form = $(   '<form enctype="application/json" action="/media" method="POST">'+
                            '<input type="hidden" name="json" value="' + escape(data) + '">'+
                        '</form>');
        $(document.body).append(form);
        form.submit();
        $(".project-list").empty();
        Cookies.remove('project', {path:'/'});
    });

    $(".project-list").on('click', '.bin', function(){
        var bin_name = $(this).attr('name');
        if (binselected === 0){
            $(this).css("background-color", "yellow").addClass("selected");
            $("#AddSelected").text('Add to bin '+ bin_name);
            binselected += 1;
        }
        else{
            var color = $(this).css("background-color");
            if(color==="rgb(255, 255, 0)"){
                $(this).removeAttr("style").removeClass("selected");
                $("#AddSelected").text('Add to project');
                binselected -= 1;
            }
            else{
                $(".bin").removeAttr("style").removeClass("selected");
                $(this).css("background-color", "yellow").addClass("selected");
                $("#AddSelected").text('Add to bin '+ bin_name);
            }
        }
    });

    $(".project-list").on('click', '.deleteButton', function(){
        var elem_uid = $(this).prop("name");
        if ($(this).closest('dt').hasClass('bin')){
            $("#AddSelected").text('Add to project');
            $(this).closest('div').empty();
        }
        else{
            $(this).closest('dt').remove();
        }
        project = deleteInProject(project, elem_uid);
        Cookies.set('project', project, {maxAge: 300000}) ;
    });
});

$( document ).ready(function(){
    $(".deleteMediaButton").click(function(){
        const id = $(this).prop("name");
        const Delform = $(    '<form action="/media/delete/'+id+'" method="POST">'+
                            '</form>');
        $(document.body).append(Delform);
        Delform.submit();
    })
})