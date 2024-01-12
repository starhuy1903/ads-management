import { useAppDispatch, useAppSelector } from '@/store';
import { ModalKey } from '@/constants/modal';
import { showModal } from '@/store/slice/modal';
import CancelRequest from './CancelRequest';
import CreateCategory from './CreateCategory';
import CropImage from './CropImage';
import GeneralModal from './GeneralModal';
import PanelDetail from './PanelDetail';
import ReportDetail from './ReportDetails';

const modalsMap: { [modalKey: string]: any } = {
  [ModalKey.CREATE_CATEGORY]: CreateCategory,
  [ModalKey.CROP_IMAGE]: CropImage,
  [ModalKey.GENERAL]: GeneralModal,
  [ModalKey.CANCEL_REQUEST]: CancelRequest,
  [ModalKey.PANEL_DETAIL]: PanelDetail,
  [ModalKey.REPORT_DETAIL]: ReportDetail,
};

export function ModalContainer() {
  const dispatch = useAppDispatch();
  const { displayModal, onModalClose, ...rest } = useAppSelector(
    (state) => state.modal,
  );

  const handleModalClose = () => {
    dispatch(showModal(null));
  };

  if (!displayModal) {
    return null;
  }

  const modalProps = {
    onModalClose: () => {
      handleModalClose();
      onModalClose?.();
    },
    ...rest,
  };

  const DisplayedModal = modalsMap[displayModal];
  return <DisplayedModal {...modalProps} />;
}
