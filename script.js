function showTableList(list){
    var modal = document.getElementById("myModal");
    var span = document.getElementsByClassName("close")[0]; 
    var tablesList = document.getElementById("tableList");
    tablesList.innerHTML = '';
    for(let i=0;i<list.length;i++){
        tablesList.innerHTML = tablesList.innerHTML + `<div onclick='openModal(this.id)' id="table-${i}" class="card table" ondrop="drop(event,this.id)" ondragover="allowDrop(event)">
        <h2>Table - ${list[i].id}</h2>
        Rs ${list[i].totalPrice}: Total Items: ${list[i].totalItems}
    </div>`;    
    }
    span.onclick = function() {
        modal.style.display = "none";
      }
      window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      }
}

function showMenuList(list){
    var menuList = document.getElementById("menuList");
    menuList.innerHTML = '';
    for(let i=0;i<list.length;i++){
        menuList.innerHTML = menuList.innerHTML + `<div id="item-${i}" class="card" draggable="true" ondragstart="drag(event)">
        <h2>${list[i].name}</h2>
        Rs ${list[i].cost}
    </div>`;    
    }
}

function loadResources(){
    showTableList(tables);
    showMenuList(menu);

    var tableSearch = document.getElementById("searchTable");
    var menuSearch = document.getElementById("menuSearch");

    tableSearch.addEventListener("input",(e)=>{
        let value  = e.target.value;
        if(value && value.trim().length>0){
            searchTable(value);
        }
        else{
            showTableList(tables);
        }   
        console.log(value);
    });

    menuSearch.addEventListener("input",(e)=>{
        let value  = e.target.value;
        if(value && value.trim().length>0){
            searchMenu(value);
        }
        else{
            showMenuList(menu);
        }   
    });
}


function searchTable(query){
    var result = tables.filter(table=>{
        return table.name.includes(query);
    });
    showTableList(result);
}

function searchMenu(query){
    var result = menu.filter(item=>{
        return item.name.includes(query);
    });
    var result2 = menu.filter(item=>{
        return item.course.includes(query);
    });
    result = result.concat(result2);
    showMenuList(result);
}

function drag(ev){
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev,elementId){
    ev.preventDefault();
    let itemCardId = ev.dataTransfer.getData("text");
    let itemId = itemCardId[itemCardId.length-1];
    let tableId = elementId[elementId.length-1];
    let item = menu[itemId];
    let searchRes = tables[tableId].items.find(i=>i.id===item.id);
    if(searchRes!=undefined){
        let index = tables[tableId].items.indexOf(searchRes);
        tables[tableId].items[index].quantity++;
    }
    else{
        item.quantity = 1;
        tables[tableId].items.push(item);
    }
    tables[tableId].totalItems++;
    tables[tableId].totalPrice = tables[tableId].totalPrice+menu[itemId].cost;
    showTableList(tables);
}

function allowDrop(ev){
    ev.preventDefault();
}

function openModal(cardId){
    document.getElementById('myModal').style.display='block';
    var tableData = document.getElementById("table-data");
    let tableId = cardId[cardId.length-1];
    let itemsList = tables[tableId].items;
    document.getElementById('table-name').innerHTML = `Table - ${tables[tableId].id} `;
    tableData.innerHTML = `<tr>
    <th>S.No</th>
    <th>Item</th>
    <th>Price</th>
    <th>Quantity</th>
    <th></th>
</tr>`;
    console.log(itemsList);
    for(let i=0;i<itemsList.length;i++){
        let price = itemsList[i].cost*itemsList[i].quantity;
        console.log(price);
        tableData.innerHTML = tableData.innerHTML + `<tr>
        <td>${i+1}</td>
        <td>${itemsList[i].name}</td>
        <td>${price}</td>
        <td><input type="number" min="1" id="quantity-${i}" class="quantity" value="${itemsList[i].quantity}"></td>
        <td id='del-${i}'><img class='del-btn' src='./deleteIcon.svg'></td>
        </tr>`;
    }
    tableData.innerHTML = tableData.innerHTML + `<tr>
    <td></td>
    <td></td>
    <td id='total-field'>Total : ${tables[tableId].totalPrice}</td>
    <td></td>
    <td></td>
    </tr>`;

    for(let i=0;i<itemsList.length;i++){
        let quantityInput = document.getElementById('quantity-'+i);
        quantityInput.addEventListener("input",(event)=>{
            updateQuantity(event.target.value,event.target.id,tableId,itemsList[i].cost);
            console.log(event.target.id);
        });
    }

    for(let i=0;i<itemsList.length;i++){
        let delBtn = document.getElementById('del-'+i);
        delBtn.onclick = ()=>deleteItem(i,tableId);
    }

    let genBillBtn = document.getElementById("gen-bill-btn");

    genBillBtn.onclick = ()=>generateBill(tableId);
}

function updateQuantity(newQuantity,cardId,tableId,cost){
    let itemId = cardId[cardId.length-1];
    let oldQty = tables[tableId].items[itemId].quantity;
    tables[tableId].items[itemId].quantity=newQuantity;
    tables[tableId].totalItems=tables[tableId].totalItems+(newQuantity-oldQty);
    tables[tableId].totalPrice = tables[tableId].totalPrice+cost*(newQuantity-oldQty);
    document.getElementById('total-field').innerHTML = `<td id='total-field'>Total : ${tables[tableId].totalPrice}</td>`;
    openModal('table-'+tableId);
    showTableList(tables);
}

function deleteItem(itemId,tableId){
    let item = tables[tableId].items[itemId];
    tables[tableId].totalItems = tables[tableId].totalItems-item.quantity;
    tables[tableId].totalPrice = tables[tableId].totalPrice-(item.cost*item.quantity);
    tables[tableId].items.splice(itemId,1);
    openModal("table-"+tableId);
    showTableList(tables);
}

function generateBill(tableId){
    tables[tableId].items=[];
    tables[tableId].totalItems=0;
    tables[tableId].totalPrice=0;
    showMenuList(menu);
    showTableList(tables);
    openModal("table-"+tableId);
    var modal = document.getElementById("myModal");
    modal.style.display='none';
}





