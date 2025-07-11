/* eslint-disable react/prop-types */
import cx from "classnames";
import { Component } from "react";
import { push } from "react-router-redux";
import { t } from "ttag";

import { FieldSet } from "metabase/common/components/FieldSet";
import CS from "metabase/css/core/index.css";
import Tables from "metabase/entities/tables";
import { connect } from "metabase/lib/redux";
import { DatabaseSchemaAndTableDataSelector } from "metabase/query_builder/components/DataSelector";
import { Icon } from "metabase/ui";

/**
 * @deprecated HOCs are deprecated
 */
const FilteredToUrlTable = (propName) => (ComposedComponent) =>
  connect(null, { push })(
    class FilteredToUrlTable extends Component {
      constructor(props) {
        super(props);
        const { table } = props.location.query || {};
        this.state = { tableId: table != null ? parseInt(table) : null };
      }

      setTableId = (tableId) => {
        this.setState({ tableId });
        this.props.push({
          ...this.props.location,
          query: tableId == null ? {} : { table: tableId },
        });
      };

      render() {
        const { [propName]: items, otherProps } = this.props;
        const { tableId } = this.state;
        const props = {
          [propName]:
            tableId == null
              ? items
              : items.filter((item) => item.table_id === tableId),
          tableSelector: (
            <TableSelector tableId={tableId} setTableId={this.setTableId} />
          ),
          ...otherProps,
        };
        return <ComposedComponent {...props} />;
      }
    },
  );

export default FilteredToUrlTable;

class TableSelectorInner extends Component {
  render() {
    const { table, tableId, setTableId } = this.props;
    return (
      <FieldSet
        noPadding
        className={cx(CS.p0, { [CS.borderBrand]: tableId != null })}
      >
        <div className={CS.p2} style={{ width: 200 }}>
          <DatabaseSchemaAndTableDataSelector
            selectedTableId={tableId}
            setSourceTableFn={setTableId}
            triggerElement={
              <span
                className={cx(
                  CS.flex,
                  CS.alignCenter,
                  CS.justifyBetween,
                  CS.flexFull,
                  CS.textMedium,
                  CS.textBold,
                )}
                data-testid="segment-list-table"
              >
                {table ? table.displayName() : t`Filter by table`}
                <Icon
                  name={table ? "close" : "chevrondown"}
                  size={12}
                  onClick={(e) => {
                    if (table) {
                      e.stopPropagation();
                      setTableId(null);
                    }
                  }}
                />
              </span>
            }
          />
        </div>
      </FieldSet>
    );
  }
}

const TableSelector = Tables.load({
  id: (state, props) => props.tableId,
  loadingAndErrorWrapper: false,
})(TableSelectorInner);
