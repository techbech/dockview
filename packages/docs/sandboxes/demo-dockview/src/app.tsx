import {
    DockviewDefaultTab,
    DockviewReact,
    DockviewReadyEvent,
    IDockviewPanelHeaderProps,
    IDockviewPanelProps,
    IDockviewHeaderActionsProps,
} from 'dockview';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { v4 } from 'uuid';
import './app.scss';

const components = {
    default: (props: IDockviewPanelProps<{ title: string }>) => {
        return <div style={{ padding: '20px' }}>{props.params.title}</div>;
    },
};

const headerComponents = {
    default: (props: IDockviewPanelHeaderProps) => {
        const onContextMenu = (event: React.MouseEvent) => {
            event.preventDefault();
            alert('context menu');
        };
        return <DockviewDefaultTab onContextMenu={onContextMenu} {...props} />;
    },
};

const Popover = (props: {
    children: React.ReactNode;
    position?: { x: number; y: number };
    close: () => void;
}) => {
    const uuid = React.useMemo(() => v4(), []);

    React.useEffect(() => {
        const listener = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                props.close();
            }
        };
        const listener2 = (event: MouseEvent) => {
            let target = event.target;

            while (target) {
                if (target instanceof HTMLElement) {
                    if (target.classList.contains(uuid)) {
                        return;
                    } else {
                        target = target.parentElement;
                    }
                } else {
                    target = null;
                }
            }

            props.close();
        };
        window.addEventListener('keypress', listener);
        window.addEventListener('mousedown', listener2);

        return () => {
            window.removeEventListener('keypress', listener);
            window.removeEventListener('mousedown', listener2);
        };
    }, [props.close, uuid]);

    if (!props.position) {
        return null;
    }

    return ReactDOM.createPortal(
        <div
            className={uuid}
            style={{
                position: 'absolute',
                top: props.position.y,
                left: props.position.x,
                background: 'white',
                border: '1px solid black',
                zIndex: 99,
                padding: '10px',
            }}
        >
            {props.children}
        </div>,
        document.body
    );
};

const Icon = (props: {
    icon: string;
    onClick?: (event: React.MouseEvent) => void;
}) => {
    return (
        <div className="action" onClick={props.onClick}>
            <span
                style={{ fontSize: 'inherit' }}
                className="material-symbols-outlined"
            >
                {props.icon}
            </span>
        </div>
    );
};

const Button = () => {
    const [position, setPosition] = React.useState<
        { x: number; y: number } | undefined
    >(undefined);

    const close = () => setPosition(undefined);

    const onClick = (event: React.MouseEvent) => {
        setPosition({ x: event.pageX, y: event.pageY });
    };

    return (
        <>
            <Icon icon="more_vert" onClick={onClick} />
            {position && (
                <Popover position={position} close={close}>
                    <div>hello</div>
                </Popover>
            )}
        </>
    );
};

const groupControlsComponents = {
    panel_1: () => {
        return <Icon icon="file_download" />;
    },
};

const RightControls = (props: IDockviewHeaderActionsProps) => {
    const Component = React.useMemo(() => {
        if (!props.isGroupActive || !props.activePanel) {
            return null;
        }

        return groupControlsComponents[props.activePanel.id];
    }, [props.isGroupActive, props.activePanel]);

    return (
        <div
            className="group-control"
            style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0px 8px',
                height: '100%',
                color: 'var(--dv-activegroup-visiblepanel-tab-color)',
            }}
        >
            {props.isGroupActive && <Icon icon="star" />}
            {Component && <Component />}
            <Button />
        </div>
    );
};

let counter = 0;

const LeftControls = (props: IDockviewHeaderActionsProps) => {
    const onClick = () => {
        props.containerApi.addPanel({
            id: `id_${Date.now().toString()}`,
            component: 'default',
            title: `Tab ${counter++}`,
            position: {
                referenceGroup: props.group,
            },
        });
    };

    return (
        <div
            className="group-control"
            style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0px 8px',
                height: '100%',
                color: 'var(--dv-activegroup-visiblepanel-tab-color)',
            }}
        >
            <Icon onClick={onClick} icon="add" />
        </div>
    );
};

const DockviewDemo = (props: { theme?: string }) => {
    const onReady = (event: DockviewReadyEvent) => {
        event.api.addPanel({
            id: 'panel_1',
            component: 'default',
            title: 'Panel 1',
        });
        event.api.addPanel({
            id: 'panel_2',
            component: 'default',
            title: 'Panel 2',
        });
        event.api.addPanel({
            id: 'panel_3',
            component: 'default',
            title: 'Panel 3',
        });
        event.api.addPanel({
            id: 'panel_4',
            component: 'default',
            title: 'Panel 4',
            position: { referencePanel: 'panel_3', direction: 'right' },
        });
        event.api.addPanel({
            id: 'panel_5',
            component: 'default',
            title: 'Panel 5',
            position: { referencePanel: 'panel_4', direction: 'within' },
        });
        event.api.addPanel({
            id: 'panel_6',
            component: 'default',
            title: 'Panel 6',
            position: { referencePanel: 'panel_4', direction: 'below' },
        });
        event.api.addPanel({
            id: 'panel_7',
            component: 'default',
            title: 'Panel 7',
            position: { referencePanel: 'panel_6', direction: 'right' },
        });
        event.api.addPanel({
            id: 'panel_8',
            component: 'default',
            title: 'Panel 8',
            position: { referencePanel: 'panel_7', direction: 'within' },
        });

        event.api.addPanel({
            id: 'panel_9',
            component: 'default',
            title: 'Panel 9',
            floating: { width: 450, height: 250 },
        });

        event.api.addPanel({
            id: 'panel_10',
            component: 'default',
            title: 'Panel 10',
            position: { referencePanel: 'panel_9' },
        });

        event.api.getPanel('panel_1')!.api.setActive();
    };

    return (
        <DockviewReact
            components={components}
            defaultTabComponent={headerComponents.default}
            rightHeaderActionsComponent={RightControls}
            leftHeaderActionsComponent={LeftControls}
            onReady={onReady}
            className={props.theme || 'dockview-theme-abyss'}
        />
    );
};

export default DockviewDemo;
