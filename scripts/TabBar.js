function TabBar(tabBar, container){
    var data = {
        tabContainer: tabBar,
        contentContainer: container,
        tabs: []};
    tabBar.addEventListener("click", function(e){
        var target = e.target;
        while(target.parentNode != this && target.parentNode)
            target = target.parentNode;
        data.activateTab(target);
            

    },false);
    var Tab = function(label, child, activate, deactivate){
        var labelElement = document.createElement("div");
        labelElement.className="tab";
        if(typeof label === "string"){
            var backup = label;
            label = document.createElement("span");
            label.innerHTML = backup;
        }
        labelElement.appendChild(label);
        var containerElement = document.createElement("div");
        containerElement.style.display="none";
        containerElement.appendChild(child);
        data.tabContainer.appendChild(labelElement);
        data.contentContainer.appendChild(containerElement);
        var ret = {label: labelElement, representedContent: containerElement, activate:activate||function(){}, deactivate:deactivate||function(){}, };
        data.tabs.push(ret);
        return ret;
    };
    data.Tab = Tab;
    data.activateTab = function(target){
        var i;
        for(i = 0; i !=data.tabs.length; i++){
            var e = data.tabs[i].label;
            e.className = e.className.replace(/(?:^|\s)active(?:$|\s)/i,"");
        }
        target.className += " active";
        
        for(i = 0; i < data.tabs.length; i++){
            if(data.tabs[i].label != target){
                data.tabs[i].representedContent.style.display="none";
                data.tabs[i].deactivate();
            }else{
                data.tabs[i].representedContent.style.display="block";
                data.tabs[i].activate();
            }
        }
    };
    return data;
}