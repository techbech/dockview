import { IDockviewPanelHeaderProps } from './dockview';
import * as React from 'react';
import { CloseButton } from '../svg';

export type IDockviewDefaultTabProps = IDockviewPanelHeaderProps &
    React.DOMAttributes<HTMLDivElement>;

export const DockviewDefaultTab: React.FunctionComponent<IDockviewDefaultTabProps> =
    ({ api, containerApi: _containerApi, params: _params, ...rest }) => {
        const onClose = React.useCallback(
            (event: React.MouseEvent<HTMLSpanElement>) => {
                event.stopPropagation();
                api.close();
            },
            [api]
        );

        const onClick = React.useCallback(
            (event: React.MouseEvent<HTMLDivElement>) => {
                api.setActive();

                if (rest.onClick) {
                    rest.onClick(event);
                }
            },
            [api, rest.onClick]
        );

        const iconClassname = React.useMemo(() => {
            const cn = ['dockview-react-tab-action'];
            return cn.join(',');
        }, []);

        return (
            <div {...rest} onClick={onClick} className="dockview-react-tab">
                <span className="dockview-react-tab-title">{api.title}</span>
                <div className={iconClassname} onClick={onClose}>
                    <CloseButton />
                </div>
            </div>
        );
    };
