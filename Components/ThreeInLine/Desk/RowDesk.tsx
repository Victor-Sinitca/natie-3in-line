import {SectorGameType} from "../../redux/threeInLine-reduser";
import {FC} from "react";
import {StyleSheet, View} from "react-native";
import * as React from "react";
import {LayoutStateType} from "./DeskThreeInLine";
import CellDesk from "./CellDesk";

type RowDeskType = {
    a: Array<SectorGameType>,
    layoutState: LayoutStateType | undefined
}
const RowDesk: FC<RowDeskType> = ({a, layoutState}) => {
    const cellDeskPrint= a.map((b) => <CellDesk key={b.sectorState.x} b={b} layoutState={layoutState}/>)
    return (
        <View style={styles.row}>
            {cellDeskPrint}
        </View>
    )
}
const styles = StyleSheet.create({
    row: {
        flex: 1,
        flexDirection: "row",    },

});
export default React.memo(RowDesk)
