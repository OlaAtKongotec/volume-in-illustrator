/*
	Scripted by Ola Persson. 
	ola@kongotec.com
	Free to use however You like. 
*/

if (SelectionExists()) {
	var i;

	var DocumentReference=app.activeDocument;
	var SelectedPaths = DocumentReference.selection;
	
	if(SelectedPaths.length > 1){
		var Message = "OH MY!\rTo many paths selected! Will use no 0.";
		alert(Message);
	}
	
	var PathReference=SelectedPaths[0];
	var Path = PathReference;
	var PathPoints = Path.pathPoints;
	
	var SelectionLeftEdge = PathReference.left;
	var SelectionTopEdge = PathReference.top;
	
	var Message = "";

	var CurrenPoint = [];
	var CurrentX, CurrentY;
	var NextPoint = [];
	var NextX, NextY;
	var PathPointsLength = PathPoints.length;
	var BottomRadius, TopRadius, ConeHeight;
	var CurrentVolume;
	var Volume = 0;
	
	for(i = 0; i<PathPointsLength; i++){
		
		CurrenPoint = PathPoints[i];
		CurrentX = CurrenPoint.anchor[0] - SelectionLeftEdge;
		CurrentY = CurrenPoint.anchor[1] - SelectionTopEdge;
		
		NextPoint = PathPoints[(i+1) % PathPointsLength];
		NextX = NextPoint.anchor[0] - SelectionLeftEdge;
		NextY = NextPoint.anchor[1] - SelectionTopEdge;
		
		BottomRadius = CurrentY < NextY ? CurrentX : NextX;
		TopRadius = CurrentY < NextY ? NextX : CurrentX;
		ConeHeight = CurrentY < NextY ? NextY - CurrentY : CurrentY - NextY;
		
		BottomRadius = PointValueToCentimeter(BottomRadius);
		TopRadius = PointValueToCentimeter(TopRadius);
		ConeHeight = PointValueToCentimeter(ConeHeight);
		
		CurrentVolume = ConeVolume(ConeHeight,BottomRadius, TopRadius);
		CurrentVolume = CurrentY < NextY ? -CurrentVolume : CurrentVolume;
		
		Volume += CurrentVolume;
		
	}
	
	Message += " Volume : " + Math.abs(Volume * 0.1) + "cl\r";
	Message += " ------------------- \r";
	
	var Header = "Volume Calculation\r";
	
	Message = Header + Message;

	alert (Message);
	
}

function PointValueToCentimeter(PointValue){
	CentimeterValue = PointValueToMillimeters(PointValue) * 0.1;
	return CentimeterValue;
}

function PointValueToMillimeters(PointValue){
	var MillimeterValue = PointValue * 0.3528;
	return MillimeterValue;
}

function ConeVolume(height, radius1, radius2) {
    return Math.PI * height / 3 * (radius1 * radius1 + radius1 * radius2 + radius2 * radius2);
}

function SelectionExists(){
	var SomethingSelected = app.documents.length > 0 && app.activeDocument.selection.length > 0 ? true : false;
	var Message = "OH MY!\rNothing Selected";
	if(!SomethingSelected) alert(Message);
	return SomethingSelected;
}

