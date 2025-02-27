import { fireEvent } from '@testing-library/dom';
import { GroupDragHandler } from '../../dnd/groupDragHandler';
import { DockviewGroupPanel } from '../../dockview/dockviewGroupPanel';
import { LocalSelectionTransfer, PanelTransfer } from '../../dnd/dataTransfer';

describe('groupDragHandler', () => {
    test('that the dnd transfer object is setup and torndown', () => {
        const element = document.createElement('div');

        const groupMock = jest.fn<DockviewGroupPanel, []>(() => {
            const partial: Partial<DockviewGroupPanel> = {
                id: 'test_group_id',
                api: { isFloating: false } as any,
            };
            return partial as DockviewGroupPanel;
        });
        const group = new groupMock();

        const cut = new GroupDragHandler(element, 'test_accessor_id', group);

        fireEvent.dragStart(element, new Event('dragstart'));

        expect(
            LocalSelectionTransfer.getInstance<PanelTransfer>().hasData(
                PanelTransfer.prototype
            )
        ).toBeTruthy();
        const transferObject =
            LocalSelectionTransfer.getInstance<PanelTransfer>().getData(
                PanelTransfer.prototype
            )![0];
        expect(transferObject).toBeTruthy();
        expect(transferObject.viewId).toBe('test_accessor_id');
        expect(transferObject.groupId).toBe('test_group_id');
        expect(transferObject.panelId).toBeNull();

        fireEvent.dragStart(element, new Event('dragend'));
        expect(
            LocalSelectionTransfer.getInstance<PanelTransfer>().hasData(
                PanelTransfer.prototype
            )
        ).toBeFalsy();

        cut.dispose();
    });
    test('that the event is cancelled when isFloating and shiftKey=true', () => {
        const element = document.createElement('div');

        const groupMock = jest.fn<DockviewGroupPanel, []>(() => {
            const partial: Partial<DockviewGroupPanel> = {
                api: { isFloating: true } as any,
            };
            return partial as DockviewGroupPanel;
        });
        const group = new groupMock();

        const cut = new GroupDragHandler(element, 'accessor_id', group);

        const event = new KeyboardEvent('dragstart', { shiftKey: false });

        const spy = jest.spyOn(event, 'preventDefault');
        fireEvent(element, event);
        expect(spy).toBeCalledTimes(1);

        const event2 = new KeyboardEvent('dragstart', { shiftKey: true });

        const spy2 = jest.spyOn(event2, 'preventDefault');
        fireEvent(element, event);
        expect(spy2).toBeCalledTimes(0);

        cut.dispose();
    });

    test('that the event is never cancelled when the group is not floating', () => {
        const element = document.createElement('div');

        const groupMock = jest.fn<DockviewGroupPanel, []>(() => {
            const partial: Partial<DockviewGroupPanel> = {
                api: { isFloating: false } as any,
            };
            return partial as DockviewGroupPanel;
        });
        const group = new groupMock();

        const cut = new GroupDragHandler(element, 'accessor_id', group);

        const event = new KeyboardEvent('dragstart', { shiftKey: false });

        const spy = jest.spyOn(event, 'preventDefault');
        fireEvent(element, event);
        expect(spy).toBeCalledTimes(0);

        const event2 = new KeyboardEvent('dragstart', { shiftKey: true });

        const spy2 = jest.spyOn(event2, 'preventDefault');
        fireEvent(element, event);
        expect(spy2).toBeCalledTimes(0);

        cut.dispose();
    });
});
