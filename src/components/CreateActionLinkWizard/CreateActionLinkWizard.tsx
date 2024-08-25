import { useImmer } from "use-immer";
import { R_Wizard } from "../Wizard/Wizard";
import { R_FAB } from "../FAB/FAB";
import { Action, generateActionSearchParams } from "../../modules/action";
import { R_BooleanOption } from "../BooleanOption/BooleanOption";
import { Connection } from "../../modules/connection";
import { R_MultiColList } from "../MultiColList/MultiColList";
import { useEffect, useMemo } from "react";
import {
  CONNECTION_ID_PARAM_NAME,
  REQUEST_ID_PARAM_NAME,
  REQUIRE_CONFIRMATION_PARAM_NAME,
} from "../../modules/const";
import { Random } from "../../modules/random";
import { OutgoingRequestType } from "../../modules/outgoing_request";
import { R_Button } from "../Button/Button";
import { BakeToast } from "../../modules/toaster";
import "./CreateActionLinkWizard.scss";
import { useKey } from "../../modules/use_key";
import { R_InfoCard } from "../InfoCard/InfoCard";

interface CreateActionLinkWizardProps {
  open: boolean;
  action: Action | null;
  connections: Connection[];
  bakeToast: BakeToast;
  onCancel: () => unknown;
}

export function R_CreateActionLinkWizard(props: CreateActionLinkWizardProps) {
  const [interactive, setInteractive] = useImmer(true);
  const [activePageIndex, setActivePageIndex] = useImmer(0);
  const [selectedConnections, setSelectedConnections] = useImmer<Connection[]>(
    [],
  );
  const [requireConfirmation, setRequireConfirmation] = useImmer(false);

  useKey("Escape", () => {
    if (activePageIndex === 0) {
      props.onCancel();
    } else {
      previousPage();
    }
  });

  const skipConnections = useMemo(
    () => props.connections.length <= 1,
    [props.connections],
  );

  const link = useMemo(() => {
    if (!props.action) return "";
    if (!skipConnections && selectedConnections.length === 0) return "";
    const connections = skipConnections
      ? [props.connections[0]]
      : selectedConnections;
    if (interactive)
      return generateInteractiveLink(
        props.action,
        connections,
        requireConfirmation,
      );
    return generateWebhookLink(
      props.action,
      connections[0],
      requireConfirmation,
    );
  }, [props.action, interactive, selectedConnections, requireConfirmation]);

  useEffect(ensureSingleConnectionIfNotInteractive, [
    selectedConnections,
    interactive,
  ]);

  function ensureSingleConnectionIfNotInteractive() {
    if (interactive) return;
    if (selectedConnections.length > 1)
      setSelectedConnections([
        selectedConnections[selectedConnections.length - 1],
      ]);
  }

  function previousPage() {
    setActivePageIndex((prevActivePageIndex) => prevActivePageIndex - 1);
  }

  function nextPage() {
    setActivePageIndex((prevActivePageIndex) => prevActivePageIndex + 1);
  }

  function toggleConnection(connection: Connection, value: boolean) {
    if (value) {
      setSelectedConnections((selectedConnections) => {
        selectedConnections.push(connection);
        return selectedConnections;
      });
    } else {
      setSelectedConnections((selectedConnections) => {
        selectedConnections.splice(selectedConnections.indexOf(connection), 1);
        return selectedConnections;
      });
    }
  }

  function reset() {
    setActivePageIndex(0);
    setSelectedConnections([]);
    setRequireConfirmation(false);
    setInteractive(true);
  }

  function copyLink() {
    navigator.clipboard.writeText(link);
    props.bakeToast({ message: "Link copied.", iconId: "content-copy" });
  }

  function generateInteractiveLink(
    action: Action,
    connections: Connection[],
    requireConfirmation: boolean,
  ) {
    if (connections.length === 0)
      throw new Error("Link requires it least 1 connection.");
    const link = new URL(
      `${location.protocol}//${location.host}${location.pathname}`,
    );
    link.searchParams.append("action", "");
    link.searchParams.append("id", action.id);
    for (const connection of connections) {
      link.searchParams.append(CONNECTION_ID_PARAM_NAME, connection.id);
    }
    link.searchParams.append(
      REQUIRE_CONFIRMATION_PARAM_NAME,
      requireConfirmation.toString(),
    );
    for (const arg of action.args) {
      link.searchParams.append(`arg_${arg.id}`, `${arg.value}`);
    }
    return link.toString();
  }

  function generateWebhookLink(
    action: Action,
    connection: Connection,
    requireConfirmation: boolean,
  ) {
    const searchParams = [
      ...generateActionSearchParams(action),
      {
        name: REQUIRE_CONFIRMATION_PARAM_NAME,
        value: requireConfirmation.toString(),
      },
      { name: CONNECTION_ID_PARAM_NAME, value: connection.id },
      { name: REQUEST_ID_PARAM_NAME, value: `static_${Random.readableId()}` },
    ];
    return connection
      .generateRequestURL(OutgoingRequestType.Action, searchParams)
      .toString();
  }

  function handleConfirm() {
    props.onCancel();
    reset();
  }

  const interactivePage = (
    <>
      <h2>Interactive link?</h2>
      <R_BooleanOption
        description={
          "Non-interactive link is just a MacroDroid webhook link that can be triggered without loading the website using HTTP GET request and such. An interactive link has to be opened in the browser for the script to trigger the webhook, however the user can request action on multiple reponses at once and immidiately see the result or responses of the request."
        }
        title="Interactive"
        iconId="eye"
        value={interactive}
        onChange={(newValue) => setInteractive(newValue)}
      />
    </>
  );

  const connectionsPage = (
    <>
      <h2>Select connections to run the action</h2>
      <R_InfoCard id="action-link-multiple-connections-notice">
        If the link is not interactive you can not select multiple connections.
      </R_InfoCard>
      <R_MultiColList items={props.connections} minColWidthPx={400}>
        {props.connections.map((connection) => (
          <R_BooleanOption
            key={connection.id}
            title={connection.name}
            onChange={(newValue) => toggleConnection(connection, newValue)}
            value={selectedConnections.includes(connection)}
          />
        ))}
      </R_MultiColList>
    </>
  );

  const confirmationPage = (
    <>
      <h2>Require confirmation?</h2>
      <R_BooleanOption
        title="Require confirmation"
        iconId="check-all"
        description="All connections will send a confirmation request immidiately after they receive the action request to ensure you that the action request was received."
        value={requireConfirmation}
        onChange={() => setRequireConfirmation(!requireConfirmation)}
      />
    </>
  );

  const linkPage = (
    <>
      <h2>Copy the link</h2>
      <pre className="link">{link}</pre>
      <R_Button
        iconId="content-copy"
        onClick={copyLink}
        title="Copy link to clipboard"
        text="Copy link"
      />
    </>
  );

  const pages = skipConnections
    ? [interactivePage, confirmationPage, linkPage]
    : [interactivePage, connectionsPage, confirmationPage, linkPage];

  return (
    <R_Wizard
      leftButton={
        <>
          <R_FAB
            hidden={activePageIndex !== 0}
            left
            title="Cancel creation of action link"
            onClick={props.onCancel}
            iconId="close"
          />
          <R_FAB
            hidden={activePageIndex === 0}
            left
            title="Previous page"
            onClick={previousPage}
            iconId="chevron-left"
          />
        </>
      }
      rightButton={
        <>
          <R_FAB
            hidden={
              activePageIndex === pages.length - 1 ||
              (!skipConnections &&
                activePageIndex === 1 &&
                selectedConnections.length === 0)
            }
            title="Next page"
            iconId="chevron-right"
            onClick={nextPage}
          />
          <R_FAB
            hidden={activePageIndex !== pages.length - 1}
            title="Confirm link creation"
            iconId="check"
            onClick={handleConfirm}
          />
        </>
      }
      open={props.open}
      pages={pages}
      activePageIndex={activePageIndex}
    />
  );
}
