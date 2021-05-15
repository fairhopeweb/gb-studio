import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import cx from "classnames";
import GlobalError from "../library/GlobalError";
import AppToolbar from "../../containers/AppToolbar";
import BackgroundsPage from "../../containers/pages/BackgroundsPage";
import SpritesPage from "../../containers/pages/SpritesPage";
import DialoguePage from "../../containers/pages/DialoguePage";
import BuildPage from "../../containers/pages/BuildPage";
import WorldPage from "../../containers/pages/WorldPage";
import UIPage from "../../containers/pages/UIPage";
import MusicPage from "../../containers/pages/MusicPage";
import PalettePage from "../../containers/pages/PalettePage";
import SettingsPage from "../../containers/pages/SettingsPage";
import l10n from "../../lib/helpers/l10n";
import { ErrorShape } from "../../store/stateShape";
import LoadingPane from "../library/LoadingPane";
import { DropZone } from "../ui/upload/DropZone";
import projectActions from "../../store/features/project/projectActions";

class App extends Component {
  constructor() {
    super();
    this.dragLeaveTimer = 0;
    this.state = {
      blur: false,
      draggingOver: false,
    };
  }

  componentDidMount() {
    window.addEventListener("blur", this.onBlur);
    window.addEventListener("focus", this.onFocus);
    window.addEventListener("resize", this.onFocus);
    window.addEventListener("dragover", this.onDragOver);
    window.addEventListener("dragleave", this.onDragLeave);
    window.addEventListener("drop", this.onDrop);
  }

  onBlur = () => {
    if (!this.state.blur) {
      this.setState({ blur: true });
    }
  };

  onFocus = () => {
    if (this.state.blur) {
      this.setState({ blur: false });
    }
  };

  onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    clearTimeout(this.dragLeaveTimer);
    const { draggingOver } = this.state;
    if (!draggingOver) {
      this.setState({ draggingOver: true });
    }
  };

  onDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    clearTimeout(this.dragLeaveTimer);
    this.dragLeaveTimer = setTimeout(() => {
      this.setState({ draggingOver: false });
    }, 100);
  };

  onDrop = (e) => {
    const { addFileToProject } = this.props;
    this.setState({ draggingOver: false });
    for (let i = 0; i < e.dataTransfer.files.length; i++) {
      const file = e.dataTransfer.files[i];
      addFileToProject(file.path);
    }
  };

  render() {
    const { section, loaded, error } = this.props;
    const { blur, draggingOver } = this.state;

    if (error.visible) {
      return <GlobalError error={error} />;
    }

    return (
      <div
        className={cx("App", {
          "App--Blur": blur,
          "App--RTL": l10n("RTL") === true,
        })}
      >
        <AppToolbar />
        {!loaded ? (
          <LoadingPane />
        ) : (
          <div className="App__Content">
            {section === "world" && <WorldPage />}
            {section === "backgrounds" && <BackgroundsPage />}
            {section === "sprites" && <SpritesPage />}
            {section === "ui" && <UIPage />}
            {section === "music" && <MusicPage />}
            {section === "palettes" && <PalettePage />}
            {section === "dialogue" && <DialoguePage />}
            {section === "build" && <BuildPage />}
            {section === "settings" && <SettingsPage />}
            {draggingOver && <DropZone />}
          </div>
        )}
      </div>
    );
  }
}

App.propTypes = {
  section: PropTypes.oneOf([
    "world",
    "backgrounds",
    "sprites",
    "ui",
    "music",
    "palettes",
    "dialogue",
    "build",
    "settings",
  ]).isRequired,
  loaded: PropTypes.bool.isRequired,
  error: ErrorShape.isRequired,
};

function mapStateToProps(state) {
  return {
    section: state.navigation.section,
    error: state.error,
    loaded: state.document.loaded,
  };
}

const mapDispatchToProps = {
  addFileToProject: projectActions.addFileToProject,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
