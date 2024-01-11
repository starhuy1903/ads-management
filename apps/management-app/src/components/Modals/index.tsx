import { useAppDispatch, useAppSelector } from '@/store';
import { ModalKey } from '@/constants/modal';
import { showModal } from '@/store/slice/modal';
import AdsRequestListViewOptions from './AdsRequestListViewOptions';
import CoordinatePicking from './CoordinatePicking';
import CancelRequest from './CancelRequest';
import CreateCategory from './CreateCategory';
import CropImage from './CropImage';
import GeneralModal from './GeneralModal';
import LocationPicking from './LocationPicking';
import PanelDetail from './PanelDetail';
import StatisticsViewOptions from './StatisticsViewOptions';
import LocationListViewOptions from './LocationListViewOptions';
import PanelListViewOptions from './PanelListViewOptions';

const modalsMap: { [modalKey: string]: any } = {
  [ModalKey.CREATE_CATEGORY]: CreateCategory,
  [ModalKey.CROP_IMAGE]: CropImage,
  [ModalKey.GENERAL]: GeneralModal,
  [ModalKey.STATISTICS_VIEW_OPTIONS]: StatisticsViewOptions,
  [ModalKey.ADS_REQUEST_VIEW_OPTIONS]: AdsRequestListViewOptions,
  [ModalKey.CANCEL_REQUEST]: CancelRequest,
  [ModalKey.PANEL_DETAIL]: PanelDetail,
  [ModalKey.COORDINATE_PICKING]: CoordinatePicking,
  [ModalKey.LOCATION_PICKING]: LocationPicking,
  [ModalKey.LOCATION_VIEW_OPTIONS]: LocationListViewOptions,
  [ModalKey.PANEL_VIEW_OPTIONS]: PanelListViewOptions,
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
