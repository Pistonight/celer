import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";

import { notesDialogStyles } from "./NotesDialog.Style";
import { DocLineText, DocLineTextWithIcon } from "core/engine";

type NotesDialogProps = {
    isOpen: boolean;
    close: () => void;
    docLine: DocLineText | DocLineTextWithIcon;
}

const noNoteErrorMessage = "No notes found for this step.";

export const NotesDialog: React.FunctionComponent<NotesDialogProps> = ({isOpen, close, docLine}) => {
    const noteText = docLine.notes?.toString();
    let lineNumber = parseInt(docLine.lineNumber);
    // All line numbers after the first are given a line number 1 too high. This adjusts for that
    lineNumber = (lineNumber == 1 ? 1 : lineNumber + 1);
    return(
        <View>
            {isOpen ? 
                <Modal transparent={true} visible={isOpen}>
                    {/* Apply transparent background */}
                    <TouchableOpacity style={notesDialogStyles.pageBackground} onPress={() => close()}>
                        {/* Create the outline */}
                        <View style={notesDialogStyles.dialogBackground}>
                            {/* Exit button */}
                            <View style={notesDialogStyles.headerRow}>
                                <Text style={notesDialogStyles.titleText}>Notes</Text>
                                <Text style={notesDialogStyles.subtitleText}>Step {lineNumber}</Text>
                            </View>
                            <View>
                                <Text style={notesDialogStyles.noteText}>
                                    {noteText || noNoteErrorMessage}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </Modal>
                :
                // If not open, return empty view
                <View/>
            }
        </View>
    );
};