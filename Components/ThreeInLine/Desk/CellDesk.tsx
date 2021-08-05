import {SectorGameType} from "../../redux/threeInLine-reduser";
import {FC} from "react";
import {StyleSheet, View} from "react-native";
import SectorMemo from "../Sector/Sector";
import * as React from "react";
import {LayoutStateType} from "./DeskThreeInLine";

type CellDeskType = {
    b: SectorGameType,
    layoutState: LayoutStateType |undefined
}
const CellDesk: FC<CellDeskType> = ({b, layoutState}) => {
    return (
        <View style={styles.cell}>
            {layoutState && <SectorMemo key={b.sectorState.x * 10 + b.sectorState.y}
                                        sector={b}
                                        heightSector={layoutState.heightSector}
            />}
        </View>
    )
}
const styles = StyleSheet.create({
    cell: {
        flex: 1,
        height: "100%",
        width: "100%",
    },
});


export default React.memo(CellDesk)
