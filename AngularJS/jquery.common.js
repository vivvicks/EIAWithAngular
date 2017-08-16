//define search autocomplete dropdown logic, with parameter of text box as item
function searchDdl(vartxt, varddl, varitems, vardiv) {

   //debugger;
    //To show div of dropdown on keyup of textbox and set focus on dropdown on 'down arrow' key
    $(document.getElementById(vardiv)).show();
    var key = window.event.keyCode; //if keycode = 40 i.e. downarrow then set focus to dropdown
    if (key == 40) {
        varddl.focus();
        return;
    }
    if (key == 9) {
        $(document.getElementById(vardiv)).hide(); 
        return; 
    }


    varddl.empty();

    //logic to filter item based on text box from dropdown and assign to array
    var exp = new RegExp("^" + vartxt.val(), "i");
    var arr = $.grep(varitems,
                function (n) {
                    return exp.test($(n).text());
                });

    //loop through filter item from array and add to dropdown
    if (arr.length > 0) {
        $.each(arr, function () {
            varddl.append(this);
            varddl.get(0).selectedIndex = 0;
        });
    }
    else {
        varddl.append("<option>No Items Found</option>");
    }
}

function selectAndHide(vartxt, varddl, vardiv) {
  //  debugger;
    var $txt = $('input[id$=' + vartxt + ']');
    $txt.val($('.' + varddl + ' option:selected').text());
    $(document.getElementById(vardiv)).hide();
    $(document.getElementById(vartxt)).focus();
}

 


    //define search autocomplete dropdown logic, with parameter of text box as item
function searchDdlold(item, $ddl, $div) {

    //var $txt = $('input[id$=txtCourierCompanyName]');
    //var $ddl1 = $('select[id$=ddlCourierCompanyName]');
    //var $items1 = $('select[id$=ddlCourierCompanyName] option');

    //debugger;
    var item1 = $(document.getElementById(item).value);
    var $ddl1 = $(document.getElementById($ddl));
    var $items1 = $(document.getElementById($ddl).options);

        $(document.getElementById($div)).show();
        $ddl1.empty();

        alert(item1.val());
        //logic to filter item based on text box from dropdown and assign to array
        //var exp = new RegExp("^" + item1.val(), "i");
        var exp = new RegExp(item1.val(), "i");
        var arr = $.grep($items1,
            function (n) {
                return exp.test($(n).text());
            });

        //loop through filter item from array and add to dropdown
        if (arr.length > 0) {
            $.each(arr, function () {
                $ddl1.append(this);
                $ddl1.get(0).selectedIndex = 0;
            });
        }

        var key = window.event.keyCode;
        if (key == 40) { $ddl1.focus(); }

        else {
            $ddl1.append("<option>No Items Found</option>");
        }
    }

$(function () {

    function AutoCompletedrpdown(txtdrpdown, ddldrpdown, vardiv) {

        $(vardiv).hide();
        //debugger;

        var $txt = $(txtdrpdown);
        var $ddl = $(ddldrpdown);
        var $items = $(ddldrpdown);
        alert($txt);
        alert($ddl);
        alert($items);
        return;
        //var $items = $('select[id$=ddlProduct] option');

        $txt.keyup(function () {
            searchDdl($txt.val());
            $("#answer").show();
            var key = window.event.keyCode;
            if (key == 40) { $ddl.focus(); }
        });

        $ddl.click(function () {
            $txt.val($('.ddlProduct option:selected').text());
            $txt.focus();
            $("#answer").hide();
        });

        $ddl.keyup(function () {
            var key = window.event.keyCode;
            if (key == 13) {
                $txt.val($('.ddlProduct option:selected').text());
                $txt.focus();
                $("#answer").hide();
            }
        });


        function searchDdl(item) {
            $ddl.empty();
            var exp = new RegExp(item, "i");
            var arr = $.grep($items,
                    function (n) {
                        return exp.test($(n).text());
                    });

            if (arr.length > 0) {
                countItemsFound(arr.length);
                $.each(arr, function () {
                    $ddl.append(this);
                    $ddl.get(0).selectedIndex = 0;
                    //$ddl.show('normal', '');
                    //$ddl.animate("height", 'fast', 'linear');
                }

                    );
            }
            else {
                countItemsFound(arr.length);
                $ddl.append("<option>No Items Found</option>");
            }
        }

    }
});
